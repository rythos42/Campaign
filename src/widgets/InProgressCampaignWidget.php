<?php
class InProgressCampaignViewModel {
    public function render() {
        
        ?>
        <!-- ko with: inProgressCampaignViewModel-->
        <div>
        <?php
        
        $createEntryWidget = new CreateEntryWidget();
        $createEntryWidget->render();
        
        $entryListWidget = new EntryListWidget();
        $entryListWidget->render();
        
        ?>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>