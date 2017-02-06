<?php
class Settings {
    public static function getDatabaseServer() {
        global $settings;
        return $settings['databaseServer'];
    }
    
    public static function getDatabaseUsername() {
        global $settings;
        return $settings['databaseUsername'];
    }
    
    public static function getDatabasePassword() {
        global $settings;
        return $settings['databasePassword'];
    }
    
    public static function getDatabaseName() {
        global $settings;
        return $settings['databaseName'];
    }
}
?>