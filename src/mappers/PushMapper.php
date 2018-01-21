<?php
class PushMapper {
    public static function notifyJoinCampaignRequest($userId, $factionId, $campaignId) {
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");
        
        $factionName = Database::queryScalar("select Faction.Name as FactionName from Faction where Faction.Id = ? and Faction.CampaignId = ?", [$factionId, $campaignId]);
        $userName = Database::queryScalar("select Username from User where User.Id = ?", [$userId]);
        
        PushMapper::notify(array( 
            'app_id' => Settings::getOneSignalAppId(),
            'contents' => array('en' => sprintf(Translation::getString('joinCampaignRequest'), $userName, $factionName)),
            'filters' => PushMapper::getFilterForCampaign($campaignId),
            'data' => array('players' => true),
            'url' => Server::getSiteUrl()
        ));
    }
    
    public static function notifyFactionEntryCreation($creatingUserId, $entryId, $territoryBeingAttackedIdOnMap) {
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");
        
        $entryInformation = Database::queryObject("
            select Username, OneSignalUserId, CampaignId, Campaign.Name as CampaignName
            from Entry
            join User on User.Id = ?
            join Campaign on Campaign.Id = CampaignId
            where Entry.Id = ?", [$creatingUserId, $entryId]);
        
        PushMapper::notify(array( 
            'app_id' => Settings::getOneSignalAppId(),
            'contents' => array('en' => sprintf(Translation::getString('hasChallengedTerritoryNotification'), 
                $entryInformation->Username, 
                $territoryBeingAttackedIdOnMap,
                $entryInformation->CampaignName)),
            'filters' => PushMapper::getFilterForCampaign($entryInformation->CampaignId),
            'data' => array('map' => true, 'entries' => true, 'players' => true),
            'url' => Server::getSiteUrl()
        )); 
    }
    
    public static function notifyFactionEntryDeletion($removingUserId, $entryId, $territoryBeingAttackedIdOnMap) {
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");
        
        $entryInformation = Database::queryObject("
            select Username, OneSignalUserId, CampaignId, Campaign.Name as CampaignName
            from Entry
            join User on User.Id = ?
            join Campaign on Campaign.Id = CampaignId
            where Entry.Id = ?", [$removingUserId, $entryId]);
            
        PushMapper::notify(array( 
            'app_id' => Settings::getOneSignalAppId(),
            'contents' => array('en' => sprintf(Translation::getString('hasChallengeRemovedNotification'), 
                $entryInformation->Username, 
                $territoryBeingAttackedIdOnMap,
                $entryInformation->CampaignName)),
            'filters' => PushMapper::getFilterForCampaign($entryInformation->CampaignId),
            'data' => array('map' => true, 'entries' => true, 'players' => true),
            'url' => Server::getSiteUrl()
        )); 
    }
    
    public static function notifyNewPhase($campaignId) {
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");

        $campaignName = Database::queryScalar("select Name from Campaign where Id = ?", [$campaignId]);
        
        PushMapper::notify(array( 
            'app_id' => Settings::getOneSignalAppId(),
            'contents' => array('en' => sprintf(Translation::getString('aNewPhaseHasBegunIn'), $campaignName)),
            'filters' => PushMapper::getFilterForCampaign($campaignId),
            'data' => array('players' => true, 'summary' => true),
            'url' => Server::getSiteUrl()
        )); 
    }
    
    public static function notifyEntryWon($campaignId, $territoryBeingAttackedIdOnMap, $winningFactionEntry) {
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");
        
        $entryInformation = Database::queryObject(
            "select User.Username as PlayerName, Faction.Name as FactionName, Campaign.Name as CampaignName
            from FactionEntry
            join User on User.Id = FactionEntry.UserId
            join Faction on Faction.Id = FactionEntry.FactionId
            join Entry on Entry.Id = FactionEntry.EntryId
            join Campaign on Campaign.Id = Entry.CampaignId
            where FactionEntry.Id = ?", [$winningFactionEntry->id]);

        PushMapper::notify(array( 
            'app_id' => Settings::getOneSignalAppId(),
            'contents' => array('en' => sprintf(Translation::getString('playerHasTakenTerritory'), 
                $entryInformation->PlayerName,
                $territoryBeingAttackedIdOnMap,
                $entryInformation->FactionName,
                $entryInformation->CampaignName)),
            'filters' => PushMapper::getFilterForCampaign($campaignId),
            'data' => array('map' => true, 'entries' => true, 'players' => true),
            'url' => Server::getSiteUrl()
        )); 
    }
    
    public static function notifyEntryDraw($campaignId, $territoryBeingAttackedIdOnMap) {
        Translation::loadTranslationFiles(Server::getFullPath() . "/lang");

        $campaignName = Database::queryScalar("select Name from Campaign where Id = ?", [$campaignId]);
        
        PushMapper::notify(array( 
            'app_id' => Settings::getOneSignalAppId(),
            'contents' => array('en' => sprintf(Translation::getString('entryDrawn'), $territoryBeingAttackedIdOnMap, $campaignName)),
            'filters' => PushMapper::getFilterForCampaign($campaignId),
            'data' => array('map' => true, 'entries' => true),
            'url' => Server::getSiteUrl()
        )); 
    }
    
    private static function getFilterForCampaign($campaignId) {
        return array(array('field' => 'tag', 'key' => $campaignId, 'relation' => 'exists'));
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
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields)); 
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
        $response = curl_exec($ch); 
        curl_close($ch);
    }
}
?>