<?php
class MapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: mapViewModel -->
        <div id="MapPanel" data-bind="visible: showMap">
            <canvas style="width: 500px" data-bind="canvas: { url: mapImageUrl, onLoad: updateImage }, drawPolygonOnCanvas: drawingPolygon, event: { mousemove: drawPolygon }"></canvas>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>