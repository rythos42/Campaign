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
        
        $dbCampaignList = Database::queryObjectList(
            "select *, 
                (select exists 
                    (select * 
                        from UserCampaignData 
                        where UserCampaignData.CampaignId = Campaign.Id and UserCampaignData.UserId = ?)) 
                as CurrentUserJoinedCampaign
                from Campaign",
                "Campaign", [User::getCurrentUser()->getId()]);
                
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
    
    public static function saveCampaignEntry($campaignEntry, $finish) {
        $createdByUserId = User::getCurrentUser()->getId();
        $createdOnDate = date('Y-m-d H:i:s');
                    
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
                    [$campaignEntryId, $factionEntry->faction->id, $factionEntry->user->id, $factionEntry->victoryPoints, $territoryBonusSpent]);
                $factionEntry->id = Database::getLastInsertedId();
            }
        }

        // Save the narrative
        if(isset($campaignEntry->narrative) && !$finish) {
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
    
    public static function createFactionEntry($campaignId, $territoryBeingAttackedIdOnMap, $factionId) {
        $currentUserId = User::getCurrentUser()->getId();
        $createdByUserId = $currentUserId;
        $attackingUserId = $currentUserId;
        $createdOnDate = date('Y-m-d H:i:s');

        // Exists if this territory is being attacked
        $attackingEntryId = Database::queryScalar(
            "select Id from Entry where CampaignId = ? and FinishDate is null and TerritoryBeingAttackedIdOnMap = ?",
            [$campaignId, $territoryBeingAttackedIdOnMap]);

        if(!isset($attackingEntryId)) {
            Database::execute(
                "insert into Entry (CampaignId, CreatedByUserId, CreatedOnDate, AttackingUserId, TerritoryBeingAttackedIdOnMap) values (?, ?, ?, ?, ?)",
                [$campaignId, $createdByUserId, $createdOnDate, $attackingUserId, $territoryBeingAttackedIdOnMap]);
            $attackingEntryId = Database::getLastInsertedId();
        }
        
        // Increment if attacking a not-owned territory, or a territory that is owned by a faction other than yours.
        $owningFactionId = Database::queryScalar('select OwningFactionId from Territory where IdOnMap = ? and CampaignId = ?', [$territoryBeingAttackedIdOnMap, $campaignId]);
        if(!(isset($owningFactionId) && $owningFactionId == $factionId))
            Database::execute("update UserCampaignData set Attacks = Attacks + 1 where UserId = ? and CampaignId = ?", [$currentUserId, $campaignId]);

        Database::execute("insert into FactionEntry (EntryId, FactionId, UserId) values (?, ?, ?)", [$attackingEntryId, $factionId, $createdByUserId]);
    }
    
    public static function deleteFactionEntry($campaignId, $factionEntryId) {
        $owningFactionId = Database::queryScalar(
            "select Territory.OwningFactionId 
                from FactionEntry
                join Entry on Entry.Id = FactionEntry.EntryId
                join Territory on Territory.IdOnMap = Entry.TerritoryBeingAttackedIdOnMap and Territory.CampaignId = Entry.CampaignId
                where FactionEntry.Id = ?", [$factionEntryId]);
        $factionEntry = Database::queryObject("select EntryId, FactionId, UserId from FactionEntry where Id = ?", [$factionEntryId]);
        if(!(isset($owningFactionId) && $owningFactionId == $factionEntry->FactionId))
            Database::execute("update UserCampaignData set Attacks = Attacks - 1 where UserId = ? and CampaignId = ?", [$factionEntry->UserId, $campaignId]);

        Database::execute("delete from FactionEntry where Id = ?", [$factionEntryId]);

        // If there are no FactionEntries remaining, remove the entry.
        $remainingFactionEntries = Database::queryScalar("select count(*) from FactionEntry where EntryId = ?", [$factionEntry->EntryId]);
        if($remainingFactionEntries == 0)
            Database::execute("delete from Entry where Id = ?", [$factionEntry->EntryId]);
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
                    
                // Determine who won
                if($factionEntry->victoryPoints > $winningVictoryPoints) {
                    $winningFactionEntry = $factionEntry;
                    $winningVictoryPoints = $factionEntry->victoryPoints;
                } else if($factionEntry->victoryPoints == $winningVictoryPoints) {
                    $winningFactionEntry = null; // draw, no one is winning
                }
            }

            // Winner takes the territory
            if(isset($winningFactionEntry)) {
                Database::execute(
                    "UPDATE Territory SET OwningFactionId = ? WHERE CampaignId = ? AND IdOnMap = ?",
                    [$winningFactionEntry->faction->id, $campaignEntry->campaignId, $campaignEntry->territoryBeingAttackedIdOnMap]);
            }

            if(isset($winningFactionEntry) && sizeof($campaignEntry->factionEntries) > 1)
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
                "select FactionEntry.*, User.Username, Faction.Name as FactionName, UserCampaignData.TerritoryBonus 
                    from FactionEntry 
                    join User on User.Id = FactionEntry.UserId
                    join Faction on Faction.Id = FactionEntry.FactionId
                    join UserCampaignData on UserCampaignData.UserId = User.Id and UserCampaignData.CampaignId = Faction.CampaignId
                    where EntryId = ?", [$entry->Id]);
            foreach($dbFactionEntryRow as $factionEntryRow) {
                $entry->FactionEntries[] = $factionEntryRow;
            }
        }
        
        return $entryList;
    }
            
    public static function joinCampaign($userId, $campaignId, $factionId) {
        $campaignCreatedByUserId = Database::queryScalar("select CreatedByUserId from Campaign where Id = ?", [$campaignId]);
        $isAdmin = ($campaignCreatedByUserId == $userId) ? 1 : 0;

        Database::execute("insert into UserCampaignData (UserId, CampaignId, FactionId, IsAdmin) values (?, ?, ?, ?)", [$userId, $campaignId, $factionId, $isAdmin]);
    }
    
    public static function renameFaction($factionId, $newFactionName) {
        Database::execute("update Faction set Name = ? where Id = ?", [$newFactionName, $factionId]);
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
    
    public static function getCampaignIdForFactionId($factionId) {
        return Database::queryScalar("select CampaignId from Faction where Id = ?", [$factionId]);
    }
}
?>