<?php
class NewsWidget {
    public function render() {
        ?>
        <!-- ko with: newsListViewModel -->
        <div data-bind="foreach: newsItems" class="grouping ui-widget ">
            <div class="news-item ui-corners-all ui-widget-content">
                <span data-bind="text: news"></span>
                <span class="created-by" ><span data-bind="text: Translation.getString('createdBy')"></span> <span data-bind="text: createdByUserName"></span></span>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>