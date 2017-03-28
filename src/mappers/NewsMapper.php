<?php
class NewsMapper {
    public static function getMainPageNews() {
        $currentUserId = User::getCurrentUser()->getId();
        
        // Get news for the current logged in user's campaigns, and for admin messages.
        return Database::queryArray(
            "select campaignNews.*, User.Username as CreatedByUserName
                from News campaignNews
                left join User on User.Id = campaignNews.CreatedByUserId
                where CampaignId in (select CampaignId from UserCampaignData where UserId = ?)
                union
                select adminNews.*, User.Username as CreatedByUserName
                from News adminNews
                left join User on User.Id = adminNews.CreatedByUserId
                where CampaignId is null
                order by CreatedOnDate desc", [$currentUserId]);
    }
    
    public static function addNews($text, $campaignId,  $entryId, $createdByUserId) {
        $today = date('Y-m-d H:i:s');
        Database::execute("insert into News (News, CampaignId, EntryId, CreatedByUserId, CreatedOnDate) values (?, ?, ?, ?, ?)", 
            [$text, $campaignId, $entryId, $createdByUserId, $today]);
    }
}
?>