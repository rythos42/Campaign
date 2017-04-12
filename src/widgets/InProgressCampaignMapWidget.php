<?php
class InProgressCampaignMapWidget {
    public function render() {
        ?>
        <!-- ko with: inProgressCampaignMapViewModel -->
        <div data-bind="visible: showMap">
            <ul class="map-legend" data-bind="foreach: legendFactions">
                <li class="ui-corner-all" data-bind="style: { 'background-color': colour }">
                    <span data-bind="css: { 'icon-star-full': isMyFaction }"></span>
                    <span data-bind="text: name"></span>
                </li>
            </ul>
            <span class="validationMessage" data-bind="visible: currentUserOutOfAttacks"><?php echo Translation::getString("youAreOutOfAttacks"); ?></span>
            <label><input type="checkbox" data-bind="checked: attackAnywhere, enable: hasAtLeastOneTerritoryBonus" />Spend 1 Material to attack anywhere</label>
            <div class="map-panel">
                <div class="loading-image" data-bind="visible: showLoadingImage"><?php $loading = new LoadingImageWidget(); $loading->render(); ?></div>
                <canvas id="EntryMapCanvas" data-bind="
                    canvas: { url: mapImageUrl, onLoad: storeImage }, 
                    drawPolygonOnCanvas: { polygon: drawingTerritory }, 
                    event: { mousemove: drawTerritory },
                    canvasClick: openTerritoryDetails">
                </canvas>
                <div class="map-buttons">
                    <button class="ui-button ui-corner-all button-icon" data-bind="clickToZoomIn: '#EntryMapCanvas'">
                        <span class="icon-plus"></span>
                    </button>
                    <button class="ui-button ui-corner-all button-icon" data-bind="clickToZoomOut: '#EntryMapCanvas'">
                        <span class="icon-minus"></span>
                    </button>
                </div>
            </div>
            <?php
                $territoryDetailsDialog = new TerritoryDetailsDialogWidget();
                $territoryDetailsDialog->render();
            ?>
        </div>
        <button data-bind="visible: !showMap(), click: startChallenge" class="ui-button  ui-corner-all"><?php echo Translation::getString("attack"); ?></button>
        <!-- /ko -->
        <?php
    }
}
?>