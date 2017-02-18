<?php
class InProgressCampaignViewModel {
    public function render() {
        
        ?>
        <!-- ko with: inProgressCampaignViewModel-->
        <div>
        <?php
        
        $createCampaignEntryWidget = new CreateCampaignEntryWidget();
        $createCampaignEntryWidget->render();
        
        $campaignEntryListWidget = new CampaignEntryListWidget();
        $campaignEntryListWidget->render();
        
        ?>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>