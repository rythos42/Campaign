<?php
class User implements JsonSerializable {
    private $id;
    private $name;
    private $permissions;
    private $userCampaignData;
    private $email;
    
    public static $TokenExpirySeconds = 60*60*24*30;
    private static $loggedInThisExecution = false;
    
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
    
    public static function setLoggedIn($cookie) {
        $expiry = time() + User::$TokenExpirySeconds;
        
        setcookie("loggedInUserCookie", $cookie, $expiry, "/");
        self::$loggedInThisExecution = true;
    }
    
    public static function getCurrentUser() {
        if(!isset($_COOKIE["loggedInUserCookie"]))
            return null;
        
        return UserMapper::getUserByCookie($_COOKIE["loggedInUserCookie"]);
    }
    
    public static function isLoggedIn() {
        if(self::$loggedInThisExecution)
            return true;
        
        return isset($_COOKIE["loggedInUserCookie"]) ? true : false;
    }
    
    public static function logout() {
        setcookie("loggedInUserCookie", "", time() - 3600, "/");
    }
    
    public static function clearOldLoginData() {    
        // Originally I used UserIds as cookie values, which was a bad idea. This is here to force old users to login again using the new scheme.
        // After all users have logged in since May 26, 2017, this function and it's call in Header.php can be removed.
        if(isset($_COOKIE["loggedInUserId"])) {
            setcookie("loggedInUserId", "", time() - 3600, "/");
            $_SESSION["user"] = null;
            $_SESSION["isLoggedIn"] = false;
        }
    }
}
?>