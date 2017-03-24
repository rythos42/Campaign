<?php
class NewsWidget {
    public function render() {
        ?>
        <!-- ko with: newsViewModel -->
        <div class="grouping ui-widget ui-corners-all ui-widget-content">
        News!
        </div>
        <!-- /ko -->
        <?php
    }
}
?>