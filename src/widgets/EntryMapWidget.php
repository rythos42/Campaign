<?php
class EntryMapWidget {
    public function render() {
        ?>
        <!-- ko with: entryMapViewModel -->
        <div data-bind="visible: showMap">
            <h3><?php echo Translation::getString("whatTerritoryIsBeingAttacked"); ?></h3>
            <div data-bind="visible: !isReadOnly()">
                <label for="FactionSelection"><?php echo Translation::getString("attacker"); ?>:</label>
                <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: attackingFaction, optionsCaption: Translation.getString('selectFaction'), optionsAfterRender: setFactionColourInList"></select>
                <span class="validationMessage" data-bind="validationMessage: selectedTerritory"></span>
            </div>
            <div class="map-panel">
                <div class="loading-image" data-bind="visible: showLoadingImage"><?php $loading = new LoadingImageWidget(); $loading->render(); ?></div>
                <canvas id="EntryMapCanvas" data-bind="
                    canvas: { url: mapImageUrl, onLoad: storeImage }, 
                    drawPolygonOnCanvas: { polygon: drawingTerritory }, 
                    event: { mousemove: drawTerritory, click: selectTerritory }">
                </canvas>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>