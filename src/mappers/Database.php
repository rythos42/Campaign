<?php
class Database {
    private static $conn;
    
    public static function connect() {
        $host = Settings::getDatabaseServer();
        $databaseName = Settings::getDatabaseName();
        $dsn = "mysql:host=$host;dbname=$databaseName;charset=utf8";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $username = Settings::getDatabaseUsername();
        $password = Settings::getDatabasePassword();
        self::$conn = new PDO($dsn, $username, $password, $options);
    }

    public static function execute($query, $params = null) {
        $statement = self::$conn->prepare($query);
        $statement->execute($params);
        return $statement;
    }
    
    public static function queryObject($query, $params = null) {
        return Database::execute($query, $params)->fetch(PDO::FETCH_OBJ);
    }
    
    public static function queryArray($query, $params = null) {
        return Database::execute($query, $params)->fetchAll();
    }
    
    public static function queryObjectList($query, $class, $params = null) {
        return Database::execute($query, $params)->fetchAll(PDO::FETCH_CLASS, $class);
    }

    public static function getLastInsertedId() {
        return self::$conn->lastInsertId();
    }
}
?>