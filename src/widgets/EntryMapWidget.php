<?php
class EntryMapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: entryMapViewModel -->
        <div class="map-panel" data-bind="visible: showMap">
            <div>
                <label for="FactionSelection"><?php echo Translation::getString("attackingFaction"); ?>:</label>
                <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: attackingFaction, optionsCaption: 'Select a faction'"></select>
            </div>
            <ul class="map-legend" data-bind="foreach: mapLegendFactions">
                <li class="ui-widget ui-corner-all" data-bind="text: name, style: { 'background-color': colour }" />
            </ul>
            <canvas id="EntryMapCanvas" data-bind="
                canvas: { url: mapImageUrl, onLoad: storeImage }, 
                drawPolygonOnCanvas: { polygon: drawingTerritory }, 
                resizeOnWindowResize: {},
                event: { mousemove: drawTerritory, click: selectTerritory }">
            </canvas>
            <img class="loading-image" src="img/gears.gif" data-bind="visible: showLoadingImage" />
            <span class="validationMessage" data-bind="validationMessage: selectedTerritory"></span>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>