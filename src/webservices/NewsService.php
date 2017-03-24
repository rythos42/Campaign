<?php 

include("../Header.php");

if(!User::isLoggedIn())
    die("You must be logged in to use this service.");

$action = $_REQUEST["action"];
        
switch($action) {
    case "GetMainPageNews":
        echo json_encode(NewsMapper::getMainPageNews());
        break;

}

?>