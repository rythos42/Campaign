<?php
class User implements JsonSerializable {
    private $id;
    private $name;
    private $permissions;
    
    function __construct($id, $name, $permissions = null) {
        $this->id = $id;
        $this->name = $name;
        $this->permissions = $permissions;
    }
    
    public function getId() {
        return $this->id;
    }
    
    public function jsonSerialize() {
        return array("Id" => $this->id, "Name" => $this->name, "Permissions" => $this->permissions);
    }
    
    public function hasPermission($permissionId) {
        foreach($this->permissions as $permission) {
            if($permission->Id === $permissionId)
                return true;
        }
        
        return false;
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