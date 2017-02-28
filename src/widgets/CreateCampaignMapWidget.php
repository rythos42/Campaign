<?php
class CreateCampaignMapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignMapViewModel -->
        <div data-bind="visible: showMap">
            <ul class="map-legend" data-bind="foreach: factions">
                <li class="ui-widget ui-corner-all" draggable="true" data-bind="style: { 'background-color': colour }, event: { dragstart: $parent.dragFaction }">
                    <span class="ui-icon drag-drop-icon"></span>
                    <span data-bind="text: name">
                </li>
            </ul>
            <canvas id="CampaignMapCanvas" data-bind="
                canvas: { url: mapImageUrl, onLoad: storeImage }, 
                drawPolygonOnCanvas: { polygon: highlightedTerritory, colour: draggingFactionColour },
                resizeOnWindowResize: {},
                event: {drop: placeFactionInTerritory, dragover: highlightDraggingTerritory, dragleave: highlightDraggingTerritory}">
            </canvas>
            <div class="button-panel">
                <input type="button" data-bind="click: saveMap, visible: showSaveMap" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>