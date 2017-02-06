<?php
class Database {
    private static $conn;
    
	public static function connect() {
        self::$conn = new mysqli(Settings::getDatabaseServer(), Settings::getDatabaseUsername(), Settings::getDatabasePassword(), Settings::getDatabaseName());
        if (self::$conn->connect_error)
            echo "Connection failed: " . self::$conn->connect_error;
    }
    
    public static function close() {
        self::$conn->close();
    }
    
    public static function prepare($query) {
        $prepared = self::$conn->prepare($query);
        if(!$prepared)
            echo "Prepare failed: (" . self::$conn->errno . ") " . self::$conn->error;
        return $prepared;
    }
    
    public static function getLastError() {
        return self::$conn->error;
    }
	
	public static function getLastInsertedId() {
		return self::$conn->insert_id;
	}
}
?>