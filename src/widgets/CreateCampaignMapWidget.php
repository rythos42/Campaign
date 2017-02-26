<?php
class CreateCampaignMapWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignMapViewModel -->
        <div data-bind="visible: showMap">
            <ul class="map-legend" data-bind="foreach: factions">
                <li class="ui-widget ui-corner-all" data-bind="text: name, style: { 'background-color': colour }" />
            </ul>
            <canvas id="CampaignMapCanvas" data-bind="
                canvas: { url: mapImageUrl, onLoad: storeImage }, 
                resizeOnWindowResize: {}"
            </canvas>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>