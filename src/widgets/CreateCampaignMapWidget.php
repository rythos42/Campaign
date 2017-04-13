<?php
class CreateCampaignMapWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignMapViewModel -->
        <div class="map-grouping ui-widget ui-corners-all ui-widget-content" data-bind="visible: showMap">
            <span>
                <input type="button" data-bind="click: saveMap" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
            </span>
            <span><?php echo Translation::getString("assignFactionsToTerritories"); ?></span>
            <span class="validationMessage" data-bind="validationMessage: factionTerritories"></span>
            <div class="map-panel">
                <div class="loading-image" data-bind="visible: showLoadingImage"><?php $loading = new LoadingImageWidget(); $loading->render(); ?></div>
                <canvas id="CampaignMapCanvas" data-bind="canvas: { url: mapImageUrl, onLoad: storeImage }, canvasClick: selectTerritory"></canvas>
                <div class="map-buttons">
                    <button class="ui-button ui-corner-all button-icon" data-bind="clickToZoomIn: '#CampaignMapCanvas'">
                        <span class="icon-plus"></span>
                    </button>
                    <button class="ui-button ui-corner-all button-icon" data-bind="clickToZoomOut: '#CampaignMapCanvas'">
                        <span class="icon-minus"></span>
                    </button>
                </div>
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