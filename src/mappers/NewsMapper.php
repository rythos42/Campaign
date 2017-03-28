<?php
class NewsMapper {
    public static function getMainPageNews() {
        return Database::queryArray(
            "select *, User.Username as CreatedByUserName
            from News
            left join User on User.Id = News.CreatedByUserId
            order by News.CreatedOnDate desc");
    }
    
    public static function addNews($text, $campaignId,  $entryId, $createdByUserId) {
        $today = date('Y-m-d H:i:s');
        Database::execute("insert into News (News, CampaignId, EntryId, CreatedByUserId, CreatedOnDate) values (?, ?, ?, ?, ?)", 
            [$text, $campaignId, $entryId, $createdByUserId, $today]);
    }
}
?>