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
        $insertCampaignReturnData = CampaignMapper::insertCampaign($name, $campaignType, $factions);
        
        if(CampaignType::Map === (int) $campaignType && User::getCurrentUser()->hasPermission(Permission::CreateMapCampaign))
            MapMapper::generateAndSaveMapForId($insertCampaignReturnData["CampaignId"]);
        
        header("Content-Type: text/json");
        echo json_encode($insertCampaignReturnData);
        break;

    case "GetCampaignList":
        echo json_encode(CampaignMapper::getCampaignList());
        break;
        
    case "SaveCampaignEntry":
        $campaignEntry = json_decode($_REQUEST["campaignEntry"]);
        $territoryIdOnMap = json_decode($_REQUEST["territoryIdOnMap"]);
        CampaignMapper::insertCampaignEntry($campaignEntry, $territoryIdOnMap);
        break;
    
    case "GetEntryList":
        $campaignId = $_REQUEST["campaignId"];
        echo json_encode(CampaignMapper::getEntriesForCampaign($campaignId));
        break;
        
    case "GetMap":
        $campaignId = $_REQUEST["campaignId"];
        header("Content-Type: image/jpeg");
        MapMapper::outputMapForCampaign($campaignId);
        break;
        
    case "GetAdjacentTerritoriesForFaction":
        $factionId = $_REQUEST["factionId"];
        echo json_encode(MapMapper::getAdjacentTerritoriesForFaction($factionId));
        break;
        
}

?>