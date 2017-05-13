<?php
class User implements JsonSerializable {
    private $id;
    private $name;
    private $permissions;
    private $userCampaignData;
    private $email;
    
    function __construct($id, $name, $email = null, $permissions = null, $userCampaignData = null) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->permissions = $permissions;
        $this->userCampaignData = $userCampaignData;
    }
        
    public function getId() {
        return $this->id;
    }
    
    public function jsonSerialize() {
        return array(
            "Id" => $this->id, 
            "Name" => $this->name, 
            "Permissions" => $this->permissions,
            "UserCampaignData" => $this->userCampaignData,
            "Email" => $this->email
        );
    }
    
    public function hasPermission($permissionId) {
        foreach($this->permissions as $permission) {
            if($permission->Id === $permissionId)
                return true;
        }
        
        return false;
    }
        
    public function setEmail($email) {
        $this->email = $email;
    }
    
    public static function setLoggedIn($user) {
        $expiry = time() + 60*60*24*30;
        
        setcookie("loggedInUserId", $user->id, $expiry, "/");
        $_SESSION["isLoggedIn"] = true;
        $_SESSION["user"] = $user;
    }
    
    public static function getCurrentUser() {
        if(!isset($_COOKIE["loggedInUserId"]))
            return null;
        
        $userId = $_COOKIE["loggedInUserId"];
        
        if(!isset($_SESSION["user"]))
            $_SESSION["user"] = UserMapper::getUserById($userId);
        
        return $_SESSION["user"];
    }
    
    public static function isLoggedIn() {
        if(isset($_SESSION["isLoggedIn"]))
            return $_SESSION["isLoggedIn"];
        
        return isset($_COOKIE["loggedInUserId"]) ? true : false;
    }
    
    public static function logout() {
        setcookie("loggedInUserId", "", time() - 3600, "/");
        $_SESSION["user"] = null;
        $_SESSION["isLoggedIn"] = false;
    }
}
?>