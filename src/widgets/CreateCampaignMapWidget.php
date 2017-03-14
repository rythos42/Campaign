<?php
class CreateCampaignMapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignMapViewModel -->
        <div class="map-grouping ui-widget ui-corners-all ui-widget-content" data-bind="visible: showMap">
            <ul class="map-legend" data-bind="foreach: factions">
                <li class="drag-drop-button ui-corner-all" draggable="true" data-bind="style: { 'background-color': colour }, event: { dragstart: $parent.dragFaction }">
                    <span data-bind="text: name">
                </li>
            </ul>
            <span>
                <input type="button" data-bind="click: saveMap" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
                <button class="ui-button ui-widget ui-corner-all button-icon" data-bind="visible: hasSelectedTerritory, click: deleteSelectedTerritory" title="<?php echo Translation::getString("removeFactionFromTerritory"); ?>">
                    <span class="icon-bin"></span>
                </button>
            </span>
            <span class="validationMessage" data-bind="validationMessage: factionTerritories"></span>
            <div class="map-panel">
                <div class="loading-image" data-bind="visible: showLoadingImage"><?php $loading = new LoadingImageWidget(); $loading->render(); ?></div>
                <canvas id="CampaignMapCanvas" data-bind="
                    canvas: { url: mapImageUrl, onLoad: storeImage }, 
                    drawPolygonOnCanvas: { polygon: highlightedTerritory, colour: draggingFactionColour },
                    drawPolygonOnCanvas: { polygon: selectedTerritory },
                    event: {drop: placeFactionInTerritory, dragover: highlightDraggingTerritory, dragleave: highlightDraggingTerritory, click: selectTerritory}">
                </canvas>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>