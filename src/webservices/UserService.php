<?php 

include("../Header.php");
$action = $_REQUEST['action'];
        
switch($action) {
    case "RegisterAndLogin":
        try {
            UserMapper::insertUser($_REQUEST["username"], $_REQUEST["password"]);
        } catch(Exception $e) {
            http_response_code(403);
            echo ExceptionCodes::UsernameExists;
            return;
        }
        
        // fall through
        
    case "Login":
        $user = UserMapper::validateLogin($_REQUEST['username'], $_REQUEST['password']);
        if($user) {
            User::setLoggedIn($user);
            echo 'true';
        }
        else {
            echo 'false';
        }
        break;
        
    case "Logout":
        if(!User::isLoggedIn())
            die("You must be logged in to use this service.");
    
        User::logout();
        break;
        
    case "GetUsersByFilter":
        echo json_encode(UserMapper::getUsersByFilter($_REQUEST["term"]));
        break;
}

include("../Footer.php");

?>