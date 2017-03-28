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
            Database::execute("INSERT INTO Faction (Name, Colour, CampaignId) VALUES (?, ?, ?)", [$faction->name, $faction->colour, $campaignId]);
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

        $dbCampaignFactionList = Database::queryObjectList("SELECT * FROM Faction", "Faction");
        foreach($dbCampaignFactionList as $campaignFaction) {
            $campaign = $campaignList[$campaignFaction->CampaignId];
            $campaign->Factions[] = $campaignFaction;
        }

        return $campaignList;
    }
    
    public static function saveCampaignEntry($campaignEntry) {
        $attackingFactionId = isset($campaignEntry->attackingFaction->id) ? $campaignEntry->attackingFaction->id : null;
        $territoryBeingAttacked = isset($campaignEntry->territoryBeingAttacked->IdOnMap) ? $campaignEntry->territoryBeingAttacked->IdOnMap : null;
        $createdByUserId = User::getCurrentUser()->getId();
        $createdOnDate = date('Y-m-d H:i:s');
        
        if(isset($campaignEntry->id)) {
            Database::execute(
                "update Entry set AttackingFactionId = ?, TerritoryBeingAttackedIdOnMap = ? where Id = ?",
                [$attackingFactionId, $territoryBeingAttacked, $campaignEntry->id]);
            $campaignEntryId = $campaignEntry->id;
        } else {        
            Database::execute(
                "insert into Entry (CampaignId, CreatedByUserId, CreatedOnDate, AttackingFactionId, TerritoryBeingAttackedIdOnMap) values (?, ?, ?, ?, ?)", 
                [$campaignEntry->campaignId, $createdByUserId, $createdOnDate, $attackingFactionId, $territoryBeingAttacked]);
            $campaignEntryId = Database::getLastInsertedId();
        }
            
        // Add/update new CampaignEntries
        foreach($campaignEntry->factionEntries as $factionEntry) {
            $territoryBonusSpent = isset($factionEntry->territoryBonusSpent) ? $factionEntry->territoryBonusSpent : null;
            
            if(isset($factionEntry->id)) {
                Database::execute(
                    "update FactionEntry set FactionId = ?, UserId = ?, VictoryPointsScored = ?, TerritoryBonusSpent = ? where Id = ?",
                    [$factionEntry->faction->id, $factionEntry->user->id, $factionEntry->victoryPoints, $territoryBonusSpent, $factionEntry->id]);
            } else {
                Database::execute(
                    "insert into FactionEntry (EntryId, FactionId, UserId, VictoryPointsScored, TerritoryBonusSpent) values (?, ?, ?, ?, ?)", 
                    [$campaignEntryId, $factionEntry->faction->id, $factionEntry->user->id, $factionEntry->victoryPoints, $territoryBonusSpentF]);
                $factionEntry->id = Database::getLastInsertedId();
            }
        }
        
        // Delete any that were removed
        $existingFactionEntries = Database::queryArray("select Id from FactionEntry where EntryId = ?", [$campaignEntryId]);
        foreach($existingFactionEntries as $dbFactionEntry) {
            $found = false;
            foreach($campaignEntry->factionEntries as $factionEntry) {
                if($dbFactionEntry["Id"] != $factionEntry->id)
                    continue;
                
                $found = true;
                break;
            }
            
            if(!$found)
                Database::execute("delete from FactionEntry where Id = ?", [$dbFactionEntry["Id"]]);
        }

        // Save the narrative
        if(isset($campaignEntry->narrative)) {
            $hasNarrative = Database::queryScalar("select count(*) from News where EntryId = ?", [$campaignEntry->id]);
            if($hasNarrative === 0) {
                Database::execute("insert into News (News, CampaignId, EntryId, CreatedByUserId, CreatedOnDate) values (?, ?, ?, ?, ?)",
                    [$campaignEntry->narrative, $campaignEntry->campaignId, $campaignEntry->id, $createdByUserId, $createdOnDate]);
            } else {
                Database::execute("update News set News = ?, CreatedByUserId = ?, CreatedOnDate = ? where EntryId = ?",
                    [$campaignEntry->narrative, $createdByUserId, $createdOnDate, $campaignEntry->id]);
            }            
        }
    }
    
    public static function finishEntry($campaignEntry) {
        if(self::isMapCampaign($campaignEntry->campaignId)) {            
            $winningFactionEntry = null;
            $winningVictoryPoints = -1;
            foreach($campaignEntry->factionEntries as $factionEntry) {
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
                    "UPDATE Territory SET OwningFactionId = ? WHERE CampaignId = ? AND IdOnMap = ?",
                    [$winningFactionEntry->faction->id, $campaignEntry->campaignId, $campaignEntry->territoryBeingAttacked->IdOnMap]);
            }
            
            Database::execute(
                "UPDATE UserCampaignData SET TerritoryBonus = TerritoryBonus + 1 WHERE UserId = ? AND CampaignId = ?", 
                [$winningFactionEntry->user->id, $campaignEntry->campaignId]);
        }
        Database::execute("update Entry set FinishDate = ? where Id = ?", [date('Y-m-d H:i:s'), $campaignEntry->id]);
    }
    
    public static function getEntriesForCampaign($campaignId) {
        $entryList = array();

        $dbEntryList = Database::queryObjectList(
            "select Entry.*, User.Username as CreatedByUsername, News.News as Narrative
            from Entry
            join User on User.Id = Entry.CreatedByUserId
            left join News on News.EntryId = Entry.Id
            where Entry.CampaignId = ?
            order by Entry.CreatedOnDate desc", 
            "Entry", [$campaignId]);
       
        foreach($dbEntryList as $entry) {
            $entryList[] = $entry;

            $dbFactionEntryRow = Database::queryArray(
                "SELECT FactionEntry.*, User.Username, Faction.Name as FactionName FROM FactionEntry 
                    JOIN User on User.Id = FactionEntry.UserId
                    JOIN Faction on Faction.Id = FactionEntry.FactionId
                    WHERE EntryId = ?", [$entry->Id]);
            foreach($dbFactionEntryRow as $factionEntryRow) {
                $entry->FactionEntries[] = $factionEntryRow;
            }
        }
        
        return $entryList;
    }
            
    public static function joinCampaign($userId, $campaignId) {
        Database::execute("INSERT INTO UserCampaignData (UserId, CampaignId) VALUES (?, ?)", [$userId, $campaignId]);
    }
    
    private static function isMapCampaign($campaignId) {
        return Database::queryScalar("select CampaignType from Campaign where Id = ?", [$campaignId]) === CampaignType::Map;
    }
    
    private static function getFactionIdForUser($userId) {
        return Database::queryScalar("select FactionId from FactionEntry where UserId = ? order by Id desc limit 1", [$userId]);
    }
    
    private static function getLastPhaseDateForCampaign($campaignId) {
        return Database::queryScalar("select max(StartDate) from Phase where CampaignId = ?", [$campaignId]);
    }
    
    private static function getUsersInFaction($campaignId, $factionId) {
        $lastPhaseDate = CampaignMapper::getLastPhaseDateForCampaign($campaignId);

        // Each person belongs to a single faction, pick their last faction they logged against.
        return Database::queryArray(
            "select UserId, FactionId, 
                (select count(*) 
                from FactionEntry t
                join Entry on Entry.Id = t.EntryId
                where t.UserId = o.UserId and FactionId = ? and CreatedOnDate > ?) as GameCount
            from FactionEntry o
            where Id = (select max(Id) From FactionEntry i where i.UserId = o.UserId)
            and FactionId = ?
            group by UserId",
            [$factionId, $lastPhaseDate, $factionId]);
    }
    
    private static function getGameCountForFactionForCurrentPhase($campaignId, $factionId) {
        $lastPhaseDate = CampaignMapper::getLastPhaseDateForCampaign($campaignId);
        
        return Database::queryScalar(
            "select count(*) 
            from FactionEntry 
            join Entry on Entry.Id = FactionEntry.EntryId
            where FactionId = ? and CreatedOnDate > ?", 
            [$factionId, $lastPhaseDate]);
    }
    
    public static function resetPhase($campaignId) {
        // Reset attacks for all userse in the campaign
        Database::execute("UPDATE UserCampaignData SET Attacks = 0 WHERE CampaignId = ?", [$campaignId]);
        
        // Do for each faction in the campaign
        $factionIdList = Database::queryScalarList("SELECT Id FROM Faction WHERE CampaignId = ?", [$campaignId]);
        foreach($factionIdList as $factionId) {
            $tbToAllocate = Database::queryScalar("SELECT count(*) as TerritoryCount FROM Territory WHERE OwningFactionId = ?", [$factionId]);
            $usersInFaction = CampaignMapper::getUsersInFaction($campaignId, $factionId);
            $totalGameCountForFaction = CampaignMapper::getGameCountForFactionForCurrentPhase($campaignId, $factionId);
            
            if($totalGameCountForFaction > 0) {
                foreach($usersInFaction as $user) {
                    // Give them a percent of the total TB equal to the percent of games out of their faction they played.
                    $percent = $user["GameCount"] / $totalGameCountForFaction;
                    $tbToGive = floor($percent * $tbToAllocate);
                    
                    Database::execute("update UserCampaignData set TerritoryBonus = TerritoryBonus + ? where UserId = ? and CampaignId = ?", [$tbToGive, $user["UserId"], $campaignId]);
                }
            }
        }
        
        Database::execute("INSERT INTO Phase (CampaignId, StartDate) VALUES (?, ?)", [$campaignId, date('Y-m-d H:i:s')]);
    }
}
?>