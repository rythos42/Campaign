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

        $winningFactionId = -1;
        $winningVictoryPoints = -1;
        foreach($campaignEntry->factionEntries as $factionEntry) {
            Database::execute(
                "INSERT INTO CampaignFactionEntry (CampaignEntryId, CampaignFactionId, UserId, VictoryPointsScored) VALUES (?, ?, ?, ?)", 
                [$campaignEntryId, $factionEntry->faction->id, $factionEntry->user->id, $factionEntry->victoryPoints]);
                
            if($factionEntry->victoryPoints > $winningVictoryPoints) {
                $winningFactionId = $factionEntry->faction->id;
                $winningVictoryPoints = $factionEntry->victoryPoints;
            } else if($factionEntry->victoryPoints == $winningVictoryPoints) {
                $winningFactionId = -1; // draw, no one is winning
            }
        }

        if($winningFactionId === $campaignEntry->attackingFaction->id) {
            Database::execute(
                "UPDATE Polygon SET OwningFactionId = ? WHERE CampaignId = ? AND IdOnMap = ?",
                [$winningFactionId, $campaignEntry->campaignId, $territoryIdOnMap]);
        }
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
}
?>