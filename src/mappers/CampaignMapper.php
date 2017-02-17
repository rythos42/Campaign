<?php 
class CampaignMapper {
    public static function insertCampaign($name, $factions) {
        $insertCampaignStatement = Database::prepare("INSERT INTO Campaign (Name, CreatedByUserId, CreatedOnDate) VALUES (?, ?, ?)");
        
        $createdByUserId = User::getUser()->getId();
        $today = date('Y-m-d H:i:s');
        $insertCampaignStatement->bind_param("sis", $name, $createdByUserId, $today);
        $insertCampaignStatement->execute();
        
        $insertCampaignFactionsSql = Database::prepare("INSERT INTO CampaignFaction (Name, CampaignId) VALUES (?, ?)");
        $campaignId = Database::getLastInsertedId();
        
        foreach($factions as $faction) {
            $insertCampaignFactionsSql->bind_param("si", $faction->name, $campaignId);
            $insertCampaignFactionsSql->execute();
        }

        $insertCampaignFactionsSql->close();
    }
    
    public static function getCampaignList() {
        $campaignList = array();

        $getCampaignStatement = Database::prepare("SELECT * FROM Campaign");
        $getCampaignStatement->execute();
        $getCampaignResults = $getCampaignStatement->get_result();
        while($campaignRow = $getCampaignResults->fetch_object()) {
            $campaignList[$campaignRow->Id] = $campaignRow;
        }
        
        $getCampaignFactionStatement = Database::prepare("SELECT * FROM CampaignFaction");
        $getCampaignFactionStatement->execute();
        $getCampaignFactionResults = $getCampaignFactionStatement->get_result();
        while($campaignFactionRow = $getCampaignFactionResults->fetch_object()) {
            $campaign = $campaignList[$campaignFactionRow->CampaignId];
            $campaign->Factions[] = $campaignFactionRow;
        }
        
        return $campaignList;
    }
    
    public static function insertCampaignEntry($campaignEntry) {
        $insertCampaignEntryStatement = Database::prepare("INSERT INTO CampaignEntry (CampaignId, CreatedByUserId, CreatedOnDate) VALUES (?, ?, ?)");
        
        $createdByUserId = User::getUser()->getId();
        $today = date('Y-m-d H:i:s');
        $insertCampaignEntryStatement->bind_param("iis", $campaignEntry->campaignId, $createdByUserId, $today);
        $insertCampaignEntryStatement->execute();
        
        $insertCampaignFactionEntrySql = Database::prepare("INSERT INTO CampaignFactionEntry (CampaignEntryId, CampaignFactionId, UserId, VictoryPointsScored) VALUES (?, ?, ?, ?)");
        $campaignEntryId = Database::getLastInsertedId();
        
        foreach($campaignEntry->factionEntries as $factionEntry) {
            $insertCampaignFactionEntrySql->bind_param("iiii", $campaignEntryId, $factionEntry->faction->id, $factionEntry->user->id, $factionEntry->victoryPoints);
            $insertCampaignFactionEntrySql->execute();
        }

        $insertCampaignFactionEntrySql->close();      
    }
    
    public static function getCampaignEntriesForCampaign($campaignId) {
        $getCampaignEntryStatement = Database::prepare("SELECT * FROM CampaignEntry WHERE CampaignId = ?");
        $getCampaignEntryStatement->bind_param("i", $campaignId);
        $getCampaignEntryStatement->execute();
        $getCampaignEntryResults = $getCampaignEntryStatement->get_result();
        
        $campaignEntryList = array();
        while($campaignEntryRow = $getCampaignEntryResults->fetch_object()) {
            $campaignEntryList[] = $campaignEntryRow;

            $getCampaignFactionEntryStatement = Database::prepare(
                "SELECT CampaignFactionEntry.*, User.Username, CampaignFaction.Name as FactionName FROM CampaignFactionEntry 
                    JOIN User on User.Id = CampaignFactionEntry.UserId
                    JOIN CampaignFaction on CampaignFaction.Id = CampaignFactionEntry.CampaignFactionId
                    WHERE CampaignEntryId = ?");
            $getCampaignFactionEntryStatement->bind_param("i", $campaignEntryRow->Id);
            $getCampaignFactionEntryStatement->execute();
            $getCampaignFactionEntryResults = $getCampaignFactionEntryStatement->get_result();
            while($campaignFactionEntryRow = $getCampaignFactionEntryResults->fetch_object()) {
                $campaignEntryRow->CampaignFactionEntries[] = $campaignFactionEntryRow;
            }
        }
        
        return $campaignEntryList;
    }
}
?>