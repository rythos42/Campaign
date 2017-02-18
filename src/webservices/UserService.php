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
        try {
            $user = UserMapper::validateLogin($_REQUEST['username'], $_REQUEST['password']);
            if($user) {
                User::setLoggedIn($user);
                echo 'true';
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
        
    case "Logout":
        if(!User::isLoggedIn())
            die("You must be logged in to use this service.");
    
        User::logout();
        break;
        
    case "GetUsersByFilter":
        if(!User::isLoggedIn())
            die("You must be logged in to use this service.");
    
        echo json_encode(UserMapper::getUsersByFilter($_REQUEST["term"]));
        break;
}

?>