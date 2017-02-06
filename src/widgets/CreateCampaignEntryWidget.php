<?php
class CreateCampaignEntryWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignEntryViewModel-->
        <input type="button" data-bind="click: requestCreateCampaignEntry, visible: showCreateCampaignEntryButton" value="Create Campaign Entry" />
        <div data-bind="visible: showCreateCampaignEntry">
            <input type="button" data-bind="click: saveCampaignEntry" value="Save" />
        </div>
        <!-- /ko -->
        <?php
    }
}
?>