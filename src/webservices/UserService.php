<?php 

include("../Header.php");
$action = $_REQUEST['action'];
        
switch($action) {
    case "RegisterAndLogin":
        UserMapper::insertUser($_REQUEST["username"], $_REQUEST["password"]);
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
}

include("../Footer.php");

?>