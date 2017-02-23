<?php
class MapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: mapViewModel -->
        <div data-bind="visible: showMap">
            <canvas id="MapCanvas" style="width: 500px" data-bind="canvas: { url: mapImageUrl, onLoad: updateImage }, drawPolygonOnCanvas: drawingTerritory, event: { mousemove: drawTerritory, click: selectTerritory }"></canvas>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>