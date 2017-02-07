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
        $getCampaignStatement = Database::prepare("SELECT * FROM Campaign");
        $getCampaignStatement->execute();
        $results = $getCampaignStatement->get_result();
        
        $campaignList = array();
        while($campaignRow = $results->fetch_object()) {
           // echo json_encode($campaignRow);
            //$campaign = new Campaign($campaignRow->Id, $campaignRow->Name);
            array_push($campaignList, $campaignRow);
        }
        return $campaignList;
    }
}
?>