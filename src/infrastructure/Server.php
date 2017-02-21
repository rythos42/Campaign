<?php
class Server {
    public static function getFullPath() {
        global $settings;
        
        if($settings['installDirOnWebServer'])
            return $_SERVER['DOCUMENT_ROOT'] . '/' . $settings['installDirOnWebServer'];
        else
            return $_SERVER['DOCUMENT_ROOT'];
    }
}
?>