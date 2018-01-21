<?php 

include("../Header.php");
$action = $_REQUEST['action'];
        
// these actions don't need to be logged in to occur
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
                $cookie = UserMapper::createAuthorizationTokenCookie($user);
                User::setLoggedIn($cookie);
                
                header("Content-Type: text/json");
                echo json_encode($user);
            }
            else {
                http_response_code(401);
                echo ExceptionCodes::LoginFailure;
                return;
            }
        } catch(Exception $e) {
            http_response_code(401);
            echo ExceptionCodes::LoginFailure;
            error_log($e);
            return;
        }
        break;
        
    case "ForgotPassword":
        $username = $_REQUEST["username"];
        echo UserMapper::forgotPassword($username);
        return;
}

if(!User::isLoggedIn())
    die("You must be logged in to use this service.");

switch($action) {        
    case "Logout":
        User::logout();
        break;
        
    case "GetUsersByFilter":
        echo json_encode(UserMapper::getUsersByFilter($_REQUEST["term"], $_REQUEST["campaignId"]));
        break;
        
    case "GetUserDataForCampaign":
        echo json_encode(UserMapper::getUserDataForCampaign(User::getCurrentUser()->getId(), $_REQUEST["campaignId"]));
        break;
        
    case "GiveTerritoryBonusInCampaignTo":
        $takeFromMe = $_REQUEST["takeFromMe"] === 'true';
        UserMapper::giveTerritoryBonusInCampaignTo($_REQUEST["userId"], $_REQUEST["campaignId"], $_REQUEST["amount"], $takeFromMe);
        break;
        
    case "SaveUserProfile":
        UserMapper::saveUserProfile(json_decode($_REQUEST["user"]));
        break;
        
    case "SetUserAdminForCampaign":
        $campaignId = $_REQUEST["campaignId"];
        $userId = $_REQUEST["userId"];
        $isAdminForCurrentCampaign = $_REQUEST["isAdminForCurrentCampaign"];
        UserMapper::setUserAdminForCampaign($campaignId, $userId, $isAdminForCurrentCampaign);
        break;
        
    case "SetOneSignalUserId":
        $oneSignalUserId = $_REQUEST["oneSignalUserId"] === '' ? null : $_REQUEST["oneSignalUserId"];
        $userId = User::getCurrentUser()->getId();
        UserMapper::setOneSignalUserId($userId, $oneSignalUserId);
        break;
        
    case "GetAllJoinedCampaignIds":
        $userId = User::getCurrentUser()->getId();
        echo json_encode(UserMapper::getAllJoinedCampaignIds($userId));
        break;
        
    case "ChangePassword":
        $userId = User::getCurrentUser()->getId();
        $password = $_REQUEST["password"];
        UserMapper::changePassword($userId, $password);
        break;
        
    case "GetRequestingUsersForCampaign":
        $campaignId = $_REQUEST["campaignId"];
        echo json_encode(UserMapper::getRequestingUsersForCampaign($campaignId));
        break;
        
    case "ApproveJoinRequest":
        $campaignId = $_REQUEST["campaignId"];
        $userId = $_REQUEST["userId"];
        UserMapper::approveJoinRequest($userId, $campaignId);
        break;
}

?>