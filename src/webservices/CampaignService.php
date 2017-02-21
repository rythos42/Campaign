<?php 

include("../Header.php");

if(!User::isLoggedIn())
    die("You must be logged in to use this service.");

$action = $_REQUEST["action"];
        
switch($action) {
    case "SaveCampaign":
        $name = $_REQUEST["name"];
        $campaignType = $_REQUEST["campaignType"];
        $factions = json_decode($_REQUEST["factions"]);
        $newCampaignId = CampaignMapper::insertCampaign($name, $campaignType, $factions);
        
        if(CampaignType::Map === (int) $campaignType && User::getCurrentUser()->hasPermission(Permission::CreateMapCampaign))
            MapMapper::generateAndSaveMapForId($newCampaignId);
        
        break;

    case "GetCampaignList":
        echo json_encode(CampaignMapper::getCampaignList());
        break;
        
    case "SaveCampaignEntry":
        $campaignEntry = json_decode($_REQUEST["campaignEntry"]);
        CampaignMapper::insertCampaignEntry($campaignEntry);
        break;
    
    case "GetCampaignEntryList":
        $campaignId = $_REQUEST["campaignId"];
        echo json_encode(CampaignMapper::getCampaignEntriesForCampaign($campaignId));
        break;
        
    case "GetMap":
        $campaignId = $_REQUEST["campaignId"];
        $mapFileName = MapMapper::getMapFileNameForCampaign($campaignId);
        
        header("Content-Type: image/jpeg");
        header("Content-Length: " . (string) filesize($mapFileName));

        $mapFile = fopen($mapFileName, 'rb');
        fpassthru($mapFile);
        break;
}

?>