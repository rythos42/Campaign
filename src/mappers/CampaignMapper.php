<?php 
class CampaignMapper {
    public static function insertCampaign($name, $campaignType, $factions) {
        $createdByUserId = User::getCurrentUser()->getId();
        $today = date('Y-m-d H:i:s');
        Database::execute("INSERT INTO Campaign (Name, CampaignType, CreatedByUserId, CreatedOnDate) VALUES (?, ?, ?, ?)", [$name, $campaignType, $createdByUserId, $today]);

        $campaignId = Database::getLastInsertedId();
        $insertCampaignReturnData = array("CampaignId" => $campaignId);
        $insertCampaignReturnData["Factions"] = array();
        
        foreach($factions as $faction) {
            Database::execute("INSERT INTO CampaignFaction (Name, Colour, CampaignId) VALUES (?, ?, ?)", [$faction->name, $faction->colour, $campaignId]);
            $insertCampaignReturnData["Factions"][$faction->name] = Database::getLastInsertedId();
        }
        
        return $insertCampaignReturnData;
    }
    
    public static function getCampaignList() {
        $campaignList = array();
        
        $dbCampaignList = Database::queryObjectList("SELECT * FROM Campaign", "Campaign");
        foreach($dbCampaignList as $campaign) {
            $campaignList[$campaign->Id] = $campaign;
        }

        $dbCampaignFactionList = Database::queryObjectList("SELECT * FROM CampaignFaction", "Faction");
        foreach($dbCampaignFactionList as $campaignFaction) {
            $campaign = $campaignList[$campaignFaction->CampaignId];
            $campaign->Factions[] = $campaignFaction;
        }

        return $campaignList;
    }
    
    public static function insertCampaignEntry($campaignEntry, $territoryIdOnMap) {
        $createdByUserId = User::getCurrentUser()->getId();
        $today = date('Y-m-d H:i:s');
        Database::execute(
            "INSERT INTO CampaignEntry (CampaignId, CreatedByUserId, CreatedOnDate, AttackingFactionId) VALUES (?, ?, ?, ?)", 
            [$campaignEntry->campaignId, $createdByUserId, $today, $campaignEntry->attackingFaction->id]);
        
        $campaignEntryId = Database::getLastInsertedId();

        $winningFactionEntry = null;
        $winningVictoryPoints = -1;
        foreach($campaignEntry->factionEntries as $factionEntry) {
            UserMapper::ensureUserDataExists($factionEntry->user->id, $campaignEntry->campaignId);

            // Insert the faction entry
            Database::execute(
                "INSERT INTO CampaignFactionEntry (CampaignEntryId, CampaignFactionId, UserId, VictoryPointsScored) VALUES (?, ?, ?, ?)", 
                [$campaignEntryId, $factionEntry->faction->id, $factionEntry->user->id, $factionEntry->victoryPoints]);
                
            // Update any TB spent by this user
            if(isset($factionEntry->territoryBonusSpent)) {
                Database::execute("UPDATE UserCampaignData SET TerritoryBonus = TerritoryBonus - ? WHERE UserId = ? AND CampaignId = ?", 
                    [$factionEntry->territoryBonusSpent, $factionEntry->user->id, $campaignEntry->campaignId]);
            }
            
            // Increment this users number of attacks
            if($factionEntry->faction->id === $campaignEntry->attackingFaction->id) {
                Database::execute("UPDATE UserCampaignData SET Attacks = Attacks + 1 WHERE UserId = ? AND CampaignId = ?",
                    [$factionEntry->user->id, $campaignEntry->campaignId]);
            }
                
            // Determine who won
            if($factionEntry->victoryPoints > $winningVictoryPoints) {
                $winningFactionEntry = $factionEntry;
                $winningVictoryPoints = $factionEntry->victoryPoints;
            } else if($factionEntry->victoryPoints == $winningVictoryPoints) {
                $winningFactionEntry = null; // draw, no one is winning
            }
        }

        // If the winner was attacking, give them the territory
        if($winningFactionEntry->faction->id === $campaignEntry->attackingFaction->id) {
            Database::execute(
                "UPDATE Polygon SET OwningFactionId = ? WHERE CampaignId = ? AND IdOnMap = ?",
                [$winningFactionEntry->faction->id, $campaignEntry->campaignId, $territoryIdOnMap]);
        }
        
        Database::execute("UPDATE UserCampaignData SET TerritoryBonus = TerritoryBonus + 1 WHERE UserId = ? AND CampaignId = ?", [$winningFactionEntry->user->id, $campaignEntry->campaignId]);
    }
    
    public static function getEntriesForCampaign($campaignId) {
        $entryList = array();

        $dbEntryList = Database::queryObjectList("SELECT * FROM CampaignEntry WHERE CampaignId = ?", "Entry", [$campaignId]);
       
        foreach($dbEntryList as $entry) {
            $entryList[] = $entry;

            $dbFactionEntryRow = Database::queryArray(
                "SELECT CampaignFactionEntry.*, User.Username, CampaignFaction.Name as FactionName FROM CampaignFactionEntry 
                    JOIN User on User.Id = CampaignFactionEntry.UserId
                    JOIN CampaignFaction on CampaignFaction.Id = CampaignFactionEntry.CampaignFactionId
                    WHERE CampaignEntryId = ?", [$entry->Id]);
            foreach($dbFactionEntryRow as $factionEntryRow) {
                $entry->FactionEntries[] = $factionEntryRow;
            }
        }
        
        return $entryList;
    }
    
    private static function getFactionIdForUser($userId) {
        return Database::queryScalar("select CampaignFactionId from CampaignFactionEntry where UserId = ? order by Id desc limit 1", [$userId]);
    }
    
    private static function getLastPhaseDateForCampaign($campaignId) {
        return Database::queryScalar("select max(StartDate) from Phase where CampaignId = ?", [$campaignId]);
    }
    
    private static function getUsersInFaction($campaignId, $factionId) {
        $lastPhaseDate = CampaignMapper::getLastPhaseDateForCampaign($campaignId);

        // Each person belongs to a single faction, pick their last faction they logged against.
        return Database::queryArray(
            "select UserId, CampaignFactionId, 
                (select count(*) 
                from CampaignFactionEntry t
                join CampaignEntry on CampaignEntry.Id = t.CampaignEntryId
                where t.UserId = o.UserId and CampaignFactionId = ? and CreatedOnDate > ?) as GameCount
            from CampaignFactionEntry o
            where Id = (select max(Id) From CampaignFactionEntry i where i.UserId = o.UserId)
            and CampaignFactionId = ?
            group by UserId",
            [$factionId, $lastPhaseDate, $factionId]);
    }
    
    private static function getGameCountForFactionForCurrentPhase($campaignId, $factionId) {
        $lastPhaseDate = CampaignMapper::getLastPhaseDateForCampaign($campaignId);
        
        return Database::queryScalar(
            "select count(*) 
            from CampaignFactionEntry 
            join CampaignEntry on CampaignEntry.Id = CampaignFactionEntry.CampaignEntryId
            where CampaignFactionId = ? and CreatedOnDate > ?", 
            [$factionId, $lastPhaseDate]);
    }
    
    public static function resetPhase($campaignId) {
        // Reset attacks for all userse in the campaign
        Database::execute("UPDATE UserCampaignData SET Attacks = 0 WHERE CampaignId = ?", [$campaignId]);
        
        // Do for each faction in the campaign
        $factionIdList = Database::queryScalarList("SELECT Id FROM CampaignFaction WHERE CampaignId = ?", [$campaignId]);
        foreach($factionIdList as $factionId) {
            $tbToAllocate = Database::queryScalar("SELECT count(*) as TerritoryCount FROM Polygon WHERE OwningFactionId = ?", [$factionId]);
            $usersInFaction = CampaignMapper::getUsersInFaction($campaignId, $factionId);
            $totalGameCountForFaction = CampaignMapper::getGameCountForFactionForCurrentPhase($campaignId, $factionId);
            
            foreach($usersInFaction as $user) {
                // Give them a percent of the total TB equal to the percent of games out of their faction they played.
                $percent = $user["GameCount"] / $totalGameCountForFaction;
                $tbToGive = floor($percent * $tbToAllocate);
                
                Database::execute("update UserCampaignData set TerritoryBonus = TerritoryBonus + ? where UserId = ? and CampaignId = ?", [$tbToGive, $user["UserId"], $campaignId]);
            }
        }
        
        Database::execute("INSERT INTO Phase (CampaignId, StartDate) VALUES (?, ?)", [$campaignId, date('Y-m-d H:i:s')]);
    }
}
?>