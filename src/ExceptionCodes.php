<?php
class ExceptionCodes {
    const UsernameExists = 1;
    
    public static function getAllCodes() {
        $cls = new ReflectionClass('ExceptionCodes');
        return $cls->getConstants();
    }
}
?>