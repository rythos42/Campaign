<?php
class CampaignEntryWidget {
    public function render() {
        
        ?>
        <!-- ko with: campaignEntryViewModel-->
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