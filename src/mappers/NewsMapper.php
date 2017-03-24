<?php
class NewsMapper {
    public static function getMainPageNews() {
        return Database::queryArray("select * from News");
    }
}
?>