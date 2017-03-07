<?php
class CampaignType {
    const Simple = 0;
    const Map = 1;
    
    public static function getAllCampaignTypes() {
        $cls = new ReflectionClass('CampaignType');
        return $cls->getConstants();
    }
}
?>