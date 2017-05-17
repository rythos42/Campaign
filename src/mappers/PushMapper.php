<?php
class PushMapper {
    public static function notifyFactionEntryCreation($creatingUserId, $entryId, $territoryBeingAttackedIdOnMap) {
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");
        
        $entryInformation = Database::queryObject("
            select Username, OneSignalUserId, CampaignId, Campaign.Name as CampaignName
            from Entry
            join User on User.Id = ?
            join Campaign on Campaign.Id = CampaignId
            where Entry.Id = ?", [$creatingUserId, $entryId]);
        
        $fields = json_encode(array( 
            'app_id' => Settings::getOneSignalAppId(),
            'contents' => array('en' => sprintf(Translation::getString('hasChallengedTerritoryNotification'), 
                $entryInformation->Username, 
                $territoryBeingAttackedIdOnMap,
                $entryInformation->CampaignName)),
            'filters' => array(array('field' => 'tag', 'key' => $entryInformation->CampaignId, 'relation' => 'exists'))
        )); 
        
        PushMapper::notify($fields);
    }
    
    public static function notifyFactionEntryDeletion($removingUserId, $entryId, $territoryBeingAttackedIdOnMap) {
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");
        
        $entryInformation = Database::queryObject("
            select Username, OneSignalUserId, CampaignId, Campaign.Name as CampaignName
            from Entry
            join User on User.Id = ?
            join Campaign on Campaign.Id = CampaignId
            where Entry.Id = ?", [$removingUserId, $entryId]);
            
        $fields = json_encode(array( 
            'app_id' => Settings::getOneSignalAppId(),
            'contents' => array('en' => sprintf(Translation::getString('hasChallengeRemovedNotification'), 
                $entryInformation->Username, 
                $territoryBeingAttackedIdOnMap,
                $entryInformation->CampaignName)),
            'filters' => array(array('field' => 'tag', 'key' => $entryInformation->CampaignId, 'relation' => 'exists'))
        )); 
        
        PushMapper::notify($fields);
    }
    
    private static function notify($fields) {
        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, 'https://onesignal.com/api/v1/notifications'); 
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Authorization: Basic ' . Settings::getOneSignalRestApiKey()
        )); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
        curl_setopt($ch, CURLOPT_HEADER, false); 
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields); 
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
        $response = curl_exec($ch); 
        curl_close($ch);
    }
}
?>