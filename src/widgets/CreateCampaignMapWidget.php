<?php
class CreateCampaignMapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignMapViewModel -->
        <div class="map-panel" data-bind="visible: showMap">
            <ul class="map-legend" data-bind="foreach: factions">
                <li class="ui-widget ui-corner-all" draggable="true" data-bind="style: { 'background-color': colour }, event: { dragstart: $parent.dragFaction }">
                    <span class="ui-icon drag-drop-icon"></span>
                    <span data-bind="text: name">
                </li>
            </ul>
            <span data-bind="visible: hasSelectedTerritory">
                <button class="ui-button ui-widget ui-corner-all button-icon" data-bind="click: deleteSelectedTerritory" title="<?php echo Translation::getString("removeFactionFromTerritory"); ?>">
                    <span class="icon-bin"></span>
                </button>
            </span>
            <div>
                <div class="loading-image" data-bind="visible: showLoadingImage"><?php $loading = new LoadingImageWidget(); $loading->render(); ?></div>
                <canvas id="CampaignMapCanvas" data-bind="
                    canvas: { url: mapImageUrl, onLoad: storeImage }, 
                    drawPolygonOnCanvas: { polygon: highlightedTerritory, colour: draggingFactionColour },
                    drawPolygonOnCanvas: { polygon: selectedTerritory },
                    event: {drop: placeFactionInTerritory, dragover: highlightDraggingTerritory, dragleave: highlightDraggingTerritory, click: selectTerritory}">
                </canvas>
                <span class="validationMessage" data-bind="validationMessage: notEveryFactionHasATerritoryValidation"></span>
            </div>
            <div class="button-panel">
                <input type="button" data-bind="click: saveMap" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>