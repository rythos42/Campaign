<?php 

include("../Header.php");

if(!User::isLoggedIn())
    die("You must be logged in to use this service.");

$action = $_REQUEST["action"];
        
switch($action) {
    case "GetMainPageNews":
        echo json_encode(NewsMapper::getMainPageNews());
        break;
        
    case "AddNews":
        $campaignId = $_REQUEST["campaignId"];
        $entryId = isset($_REQUEST["entryId"]) ? $_REQUEST["entryId"] : null;
        $createdByUserId = $_REQUEST["createdByUserId"];
        $text = $_REQUEST["text"];
        NewsMapper::addNews($text, $campaignId, $entryId, $createdByUserId);
        break;

}

?>