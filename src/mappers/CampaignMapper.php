<?php 
class CampaignMapper {
    public static function insertCampaign($name, $factions) {
        $createdByUserId = User::getUser()->getId();
        $today = date('Y-m-d H:i:s');
        Database::execute("INSERT INTO Campaign (Name, CreatedByUserId, CreatedOnDate) VALUES (?, ?, ?)", [$name, $createdByUserId, $today]);

        $campaignId = Database::getLastInsertedId();
        
        foreach($factions as $faction) {
            Database::execute("INSERT INTO CampaignFaction (Name, CampaignId) VALUES (?, ?)", [$faction->name, $campaignId]);
        }
    }
    
    public static function getCampaignList() {
        $campaignList = array();
        
        $dbCampaignList = Database::queryObjectList("SELECT * FROM Campaign", "Campaign");
        foreach($dbCampaignList as $campaign) {
            $campaignList[$campaign->Id] = $campaign;
        }

        $dbCampaignFactionList = Database::queryObjectList("SELECT * FROM CampaignFaction", "CampaignFaction");
        foreach($dbCampaignFactionList as $campaignFaction) {
            $campaign = $campaignList[$campaignFaction->CampaignId];
            $campaign->Factions[] = $campaignFaction;
        }

        return $campaignList;
    }
    
    public static function insertCampaignEntry($campaignEntry) {
        $createdByUserId = User::getUser()->getId();
        $today = date('Y-m-d H:i:s');
        Database::execute("INSERT INTO CampaignEntry (CampaignId, CreatedByUserId, CreatedOnDate) VALUES (?, ?, ?)", [$campaignEntry->campaignId, $createdByUserId, $today]);
        
        $campaignEntryId = Database::getLastInsertedId();
        
        foreach($campaignEntry->factionEntries as $factionEntry) {
            Database::execute("INSERT INTO CampaignFactionEntry (CampaignEntryId, CampaignFactionId, UserId, VictoryPointsScored) VALUES (?, ?, ?, ?)", [$campaignEntryId, $factionEntry->faction->id, $factionEntry->user->id, $factionEntry->victoryPoints]);
        }
    }
    
    public static function getCampaignEntriesForCampaign($campaignId) {
        $campaignEntryList = array();

        $dbCampaignEntryList = Database::queryObjectList("SELECT * FROM CampaignEntry WHERE CampaignId = ?", "CampaignEntry", [$campaignId]);
       
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