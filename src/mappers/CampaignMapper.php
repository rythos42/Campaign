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
}
?>