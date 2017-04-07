<?php 

include("../Header.php");

if(!User::isLoggedIn())
    die("You must be logged in to use this service.");

$action = $_REQUEST["action"];
        
switch($action) {
    case "GetMoreNews":
        $lastLoadedDate = $_REQUEST["lastLoadedDate"];
        $numberToLoad = $_REQUEST["numberToLoad"];
        echo json_encode(NewsMapper::getMoreNews($lastLoadedDate, $numberToLoad));
        break;
        
    case "GetNewNewsSince":
        $since = $_REQUEST["since"];
        echo json_encode(NewsMapper::getNewNewsSince($since));
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