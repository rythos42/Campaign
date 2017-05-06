<?php
class NewsMapper {
    public static function getMoreNews($lastLoadedDate, $numberToLoad) {
        $currentUserId = User::getCurrentUser()->getId();

        // Get news for the current logged in user's campaigns, and for admin messages.
        return Database::queryArray(
            "select campaignNews.*, User.Username as CreatedByUserName, Campaign.Name as CampaignName
                from News campaignNews
                left join User on User.Id = campaignNews.CreatedByUserId
                left join Campaign on Campaign.Id = campaignNews.CampaignId
                where CampaignId in (select CampaignId from UserCampaignData where UserId = ?) and campaignNews.CreatedOnDate < ?
                union
                select adminNews.*, User.Username as CreatedByUserName, Campaign.Name as CampaignName
                from News adminNews
                left join User on User.Id = adminNews.CreatedByUserId
                left join Campaign on Campaign.Id = adminNews.CampaignId
                where CampaignId is null and adminNews.CreatedOnDate < ?
                order by CreatedOnDate desc
                limit ?", [$currentUserId, $lastLoadedDate, $lastLoadedDate, $numberToLoad]);
    }
    
    public static function getNewNewsSince($since) {
        $currentUserId = User::getCurrentUser()->getId();
        
        return Database::queryArray(
            "select campaignNews.*, User.Username as CreatedByUserName, Campaign.Name as CampaignName
                from News campaignNews
                left join User on User.Id = campaignNews.CreatedByUserId
                left join Campaign on Campaign.Id = campaignNews.CampaignId
                where CampaignId in (select CampaignId from UserCampaignData where UserId = ?) and campaignNews.CreatedOnDate > ?
                union
                select adminNews.*, User.Username as CreatedByUserName, Campaign.Name as CampaignName
                from News adminNews
                left join User on User.Id = adminNews.CreatedByUserId
                left join Campaign on Campaign.Id = adminNews.CampaignId
                where CampaignId is null and adminNews.CreatedOnDate > ?
                order by CreatedOnDate desc", [$currentUserId, $since, $since]);
    }
    
    public static function addNews($text, $campaignId,  $entryId, $createdByUserId) {
        $today = date('Y-m-d H:i:s');
        Database::execute("insert into News (News, CampaignId, EntryId, CreatedByUserId, CreatedOnDate) values (?, ?, ?, ?, ?)", 
            [$text, $campaignId, $entryId, $createdByUserId, $today]);
    }
}
?>