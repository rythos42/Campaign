<?php
class NewsWidget {
    public function render() {
        ?>
        <!-- ko with: newsListViewModel -->
        <div data-bind="visible: showNews, foreach: newsItems" class="grouping ui-widget ">
            <div class="news-item ui-corners-all ui-widget-content">
                <span class="news" data-bind="text: news, css: {'smaller': smallerText, 'smallest': smallestText}"></span>
                <span class="created-by" ><span data-bind="text: Translation.getString('createdBy')"></span> <span class="username" data-bind="text: createdByUserName"></span></span>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>