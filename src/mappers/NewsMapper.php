<?php
class NewsMapper {
    public static function getMainPageNews() {
        return Database::queryArray(
            "select *, User.Username as CreatedByUserName
            from News
            left join User on User.Id = News.CreatedByUserId");
    }
}
?>