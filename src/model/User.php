<?php
class User {
	var $isLoggedIn;
	var $name;
	
	public static function setLoggedIn() {
		$_SESSION["isLoggedIn"] = true;
	}
	
	public static function isLoggedIn() {
		return self::getSession("isLoggedIn");
	}
	
	public static function logout() {
		$_SESSION["isLoggedIn"] = false;
	}
	
	private static function getSession($key) {
		return isset($_SESSION[$key]) ? $_SESSION[$key] : null;
	}
}
?>