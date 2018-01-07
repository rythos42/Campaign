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
    
    public static function getOneSignalAppId() {
        global $settings;
        return $settings['oneSignalAppId'];
    }  
    
    public static function getOneSignalRestApiKey() {
        global $settings;
        return $settings['oneSignalRestApiKey'];
    }
    
    public static function hasOneSignalEnabled() {
        return Settings::getOneSignalAppId() && Settings::getOneSignalRestApiKey();
    }
    
    public static function getOpenGraphImageUrl() {
        global $settings;
        return $settings['openGraphImageUrl'];
    }
}
?>