<?php
class InProgressCampaignViewModel {
    public function render() {
        
        ?>
        <!-- ko with: inProgressCampaignViewModel-->
        <div data-bind="visible: showInProgressCampaign">
            <input type="button" data-bind="click: requestCreateEntry" value="<?php echo Translation::getString("createEntry"); ?>" class="ui-button ui-widget ui-corner-all" />
            <input type="button" data-bind="click: back" value="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all" />
        </div>
        <?php
        $createEntryWidget = new CreateEntryWidget();
        $createEntryWidget->render();
        
        $entryListWidget = new EntryListWidget();
        $entryListWidget->render();
        ?>
        <!-- /ko -->
        <?php        
    }
}
?>