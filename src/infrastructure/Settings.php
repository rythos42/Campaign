<?php
class Settings {
    public static function getDatabaseServer() {
        return Settings::getSetting('databaseServer');
    }
    
    public static function getDatabaseUsername() {
        return Settings::getSetting('databaseUsername');
    }
    
    public static function getDatabasePassword() {
        return Settings::getSetting('databasePassword');
    }
    
    public static function getDatabaseName() {
        return Settings::getSetting('databaseName');
    }  
    
    public static function getOneSignalAppId() {
        return Settings::getSetting('oneSignalAppId');
    }  
    
    public static function getOneSignalRestApiKey() {
        return Settings::getSetting('oneSignalRestApiKey');
    }
    
    public static function hasOneSignalEnabled() {
        return Settings::getOneSignalAppId() && Settings::getOneSignalRestApiKey();
    }
    
    public static function getOpenGraphImageUrl() {
        return Settings::getSetting('openGraphImageUrl');
    }
    
    public static function getOpenGraphImageWidth() {
        return Settings::getSetting('openGraphImageWidth');
    }
    
    public static function getOpenGraphImageHeight() {
        return Settings::getSetting('openGraphImageHeight');
    }
    
    public static function getSystemFromEmailAddress() {
        return Settings::getSetting('systemFromEmailAddress');
    }
    
    private static function getSetting($name) {
        global $settings;
        return (isset($settings[$name]) ? $settings[$name] : null);
    }
}
?>