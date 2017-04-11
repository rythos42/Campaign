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
        $_SESSION["isLoggedIn"] = true;
        $_SESSION["user"] = $user;
    }
    
    public static function getCurrentUser() {
        return $_SESSION["user"];
    }
    
    public static function isLoggedIn() {
        return self::getSession("isLoggedIn");
    }
    
    public static function logout() {
        $_SESSION["isLoggedIn"] = false;
        $_SESSION["user"] = null;
    }
    
    private static function getSession($key) {
        return isset($_SESSION[$key]) ? $_SESSION[$key] : null;
    }
}
?>