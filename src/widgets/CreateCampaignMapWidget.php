<?php
class CreateCampaignMapWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignMapViewModel -->
        <div class="map-grouping ui-widget ui-corners-all ui-widget-content" data-bind="visible: showMap">
            <span>
                <input type="button" data-bind="click: saveMap" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
            </span>
            <h3><?php echo Translation::getString("assignFactionsToTerritories"); ?></h3>
            <span class="validationMessage" data-bind="validationMessage: factionTerritories"></span>
            <div class="map-panel">
                <div class="loading-image" data-bind="visible: showLoadingImage"><?php $loading = new LoadingImageWidget(); $loading->render(); ?></div>
                <canvas id="CampaignMapCanvas" data-bind="canvas: { url: mapImageUrl, onLoad: storeImage }, event: { click: selectTerritory }"></canvas>
            </div>
        </div>
        <?php
            $editTerritoryDialogWidget = new EditTerritoryDialogWidget();
            $editTerritoryDialogWidget->render();
        ?>
        <!-- /ko -->
        <?php
    }
}
?>