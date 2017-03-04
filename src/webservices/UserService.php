<?php 

include("../Header.php");
$action = $_REQUEST['action'];
        
// these two actions don't need to be logged in to occur
switch($action) {
    case "RegisterAndLogin":
        try {
            UserMapper::insertUser($_REQUEST["username"], $_REQUEST["password"]);
        } catch(Exception $e) {
            http_response_code(403);
            echo ExceptionCodes::UsernameExists;
            return;
        }
        
        // fall through to login
        
    case "Login":
        try {
            $user = UserMapper::validateLogin($_REQUEST['username'], $_REQUEST['password']);
            if($user) {
                User::setLoggedIn($user);
                
                header("Content-Type: text/json");
                echo json_encode($user);
            }
            else {
                http_response_code(401);
                echo ExceptionCodes::LoginFailure;
            }
        } catch(Exception $e) {
            http_response_code(401);
            echo ExceptionCodes::LoginFailure;
        }
        break;
}

if(!User::isLoggedIn())
    die("You must be logged in to use this service.");

switch($action) {        
    case "Logout":
        User::logout();
        break;
        
    case "GetUsersByFilter":
        echo json_encode(UserMapper::getUsersByFilter($_REQUEST["term"]));
        break;
        
    case "GetUserDataForCampaign":
        echo json_encode(UserMapper::getUserDataForCampaign(User::getCurrentUser()->getId(), $_REQUEST["campaignId"]));
        break;
        
    case "GiveTerritoryBonusInCampaignTo":
        UserMapper::giveTerritoryBonusInCampaignTo($_REQUEST["userId"], $_REQUEST["campaignId"], $_REQUEST["amount"]);
        break;
}

?>