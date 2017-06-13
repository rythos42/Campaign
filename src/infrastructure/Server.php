<?php
class Server {
    public static function getFullPath() {
        global $settings;
        
        if($settings['installDirOnWebServer']) {
            $installDir = $_SERVER['DOCUMENT_ROOT'] . '/' . $settings['installDirOnWebServer'];
            if(file_exists($installDir))
                return $installDir;
            return $settings['installDirOnWebServer'];
        }
        else
            return $_SERVER['DOCUMENT_ROOT'];
    }
    
    public static function getSiteUrl() {
        global $settings;
        
        $root = "https://" . $_SERVER['SERVER_NAME'];
        
        if($settings['siteSubDir'])
            return $root. '/' . $settings['siteSubDir'];
        return $root;
    }
}
?>