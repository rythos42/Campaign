<?php
class InProgressCampaignViewModel {
    public function render() {
        
        ?>
        <!-- ko with: inProgressCampaignViewModel-->
        <div>
        <?php
        
        $createCampaignEntryWidget = new CreateCampaignEntryWidget();
        $createCampaignEntryWidget->render();
        
        ?>
        
        <div id="MapPanel" data-bind="visible: showMap">
            <img data-bind="attr: { src: mapImageUrl }" />
        </div>
        
        <?php
        
        $campaignEntryListWidget = new CampaignEntryListWidget();
        $campaignEntryListWidget->render();
        
        ?>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>