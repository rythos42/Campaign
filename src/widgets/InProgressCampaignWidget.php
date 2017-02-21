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
        
        <img data-bind="visible: showMap, attr: { src: mapImageUrl }" />
        
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