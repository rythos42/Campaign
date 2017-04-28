<?php
class NewsWidget {
    public function render() {
        ?>
        <!-- ko with: newsListViewModel -->
        <div data-bind="visible: showNews, infiniteScroll: addMoreNewsItems, foreach: newsItems" style="display: none;" class="grouping ui-widget">
            <div class="news-item ui-corners-all ui-widget-content">
                <span class="news" data-bind="html: news, css: {'smaller': smallerText, 'smallest': smallestText}"></span>
                <button class="link-button" data-bind="visible: showMoreLessButtons, click: toggleMoreLess, text: showMoreLessButtonText"></button>
                <span class="created-by" >
                    <?php echo Translation::getString("createdBy"); ?> <span class="username" data-bind="text: createdByUserName"></span>
                    <span data-bind="visible: isCampaignNews"><?php echo Translation::getString("in"); ?> <span class="campaign-name" data-bind="text: campaignName"></span></span>
                </span>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>