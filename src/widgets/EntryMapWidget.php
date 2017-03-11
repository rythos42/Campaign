<?php
class EntryMapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: entryMapViewModel -->
        <div class="map-panel" data-bind="visible: showMap">
            <div>
                <label for="FactionSelection"><?php echo Translation::getString("attackingFaction"); ?>:</label>
                <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: attackingFaction, optionsCaption: Translation.getString('selectFaction')"></select>
            </div>
            <ul class="map-legend" data-bind="foreach: mapLegendFactions">
                <li class="ui-widget ui-corner-all" data-bind="text: name, style: { 'background-color': colour }" />
            </ul>
            <div>
                <div class="loading-image" data-bind="visible: showLoadingImage"><?php $loading = new LoadingImageWidget(); $loading->render(); ?></div>
                <canvas id="EntryMapCanvas" data-bind="
                    canvas: { url: mapImageUrl, onLoad: storeImage }, 
                    drawPolygonOnCanvas: { polygon: drawingTerritory }, 
                    event: { mousemove: drawTerritory, click: selectTerritory }">
                </canvas>
            </div>
            <span class="validationMessage" data-bind="validationMessage: selectedTerritory"></span>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>