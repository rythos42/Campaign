<?php 

include("../Header.php");

if(!User::isLoggedIn())
	die("You must be logged in to use this service.");


$action = $_REQUEST["action"];
		
switch($action) {
	case "SaveCampaign":
		$name = $_REQUEST["name"];
		$numberOfFactions = $_REQUEST["numberOfFactions"];
		CampaignMapper::insertCampaign($name, $numberOfFactions);
		break;
}

?>