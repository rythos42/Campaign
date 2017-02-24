<?php
class MapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: mapViewModel -->
        <div data-bind="visible: showMap">
            <ul id="MapLegend" data-bind="foreach: factions">
                <li class="ui-widget ui-corner-all" data-bind="text: name, style: { 'background-color': colour }" />
            </ul>
            <canvas id="MapCanvas" style="width: 500px" data-bind="canvas: { url: mapImageUrl, onLoad: updateImage }, drawPolygonOnCanvas: drawingTerritory, event: { mousemove: drawTerritory, click: selectTerritory }"></canvas>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>