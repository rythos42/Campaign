<?php 
class CampaignMapper {
    public static function insertCampaign($name, $numberOfFactions) {
        $query = Database::prepare("INSERT INTO Campaign (Name, FactionCount, CreatedByUserId, CreatedOnDate) VALUES (?, ?, ?, ?)");
        
		$createdByUserId = User::getUser()->getId();
        $today = date('Y-m-d H:i:s');
        $query->bind_param("siis", $name, $numberOfFactions, $createdByUserId, $today);
        
        $query->execute();        
        $query->close();
    }
}
?>