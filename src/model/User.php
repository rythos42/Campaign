<?php
class User {
    private $id;
    private $name;
    
    function __construct($id, $name) {
        $this->id = $id;
        $this->name = $name;
    }
    
    public function getId() {
        return $this->id;
    }
    
    public static function setLoggedIn($user) {
        $_SESSION["isLoggedIn"] = true;
        $_SESSION["user"] = $user;
    }
    
    public static function getUser() {
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