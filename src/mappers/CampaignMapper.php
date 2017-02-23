<?php 
class CampaignMapper {
    public static function insertCampaign($name, $campaignType, $factions) {
        $createdByUserId = User::getCurrentUser()->getId();
        $today = date('Y-m-d H:i:s');
        Database::execute("INSERT INTO Campaign (Name, CampaignType, CreatedByUserId, CreatedOnDate) VALUES (?, ?, ?, ?)", [$name, $campaignType, $createdByUserId, $today]);

        $campaignId = Database::getLastInsertedId();
        
        foreach($factions as $faction) {
            Database::execute("INSERT INTO CampaignFaction (Name, Colour, CampaignId) VALUES (?, ?, ?)", [$faction->name, $faction->colour, $campaignId]);
        }
        
        return $campaignId;
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
            "INSERT INTO CampaignEntry (CampaignId, CreatedByUserId, CreatedOnDate, UsersFactionId) VALUES (?, ?, ?, ?)", 
            [$campaignEntry->campaignId, $createdByUserId, $today, $campaignEntry->usersFaction->id]);
        
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
            }
        }

        if($winningFactionId === $campaignEntry->usersFaction->id) {
            Database::execute(
                "UPDATE Polygon SET OwningFactionId = ? WHERE CampaignId = ? AND IdOnMap = ?",
                [$winningFactionId, $campaignEntry->campaignId, $territoryIdOnMap]);
        }
    }
    
    public static function getCampaignEntriesForCampaign($campaignId) {
        $campaignEntryList = array();

        $dbCampaignEntryList = Database::queryObjectList("SELECT * FROM CampaignEntry WHERE CampaignId = ?", "Entry", [$campaignId]);
       
        foreach($dbCampaignEntryList as $campaignEntry) {
            $campaignEntryList[] = $campaignEntry;

            $dbCampaignFactionEntryRow = Database::queryArray(
                "SELECT CampaignFactionEntry.*, User.Username, CampaignFaction.Name as FactionName FROM CampaignFactionEntry 
                    JOIN User on User.Id = CampaignFactionEntry.UserId
                    JOIN CampaignFaction on CampaignFaction.Id = CampaignFactionEntry.CampaignFactionId
                    WHERE CampaignEntryId = ?", [$campaignEntry->Id]);
            foreach($dbCampaignFactionEntryRow as $campaignFactionEntryRow) {
                $campaignEntry->CampaignFactionEntries[] = $campaignFactionEntryRow;
            }
        }
        
        return $campaignEntryList;
    }
}
?>