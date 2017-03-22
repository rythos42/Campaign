<?php
class EntryListWidget {
    public function render() {
        ?>
        <!-- ko with: entryListViewModel -->
        <div data-bind="visible: showCampaignEntryList">
            <h3><?php echo Translation::getString("entries"); ?></h3>
            <table class="ui-widget ui-corners-all ui-widget-content">
                <thead>
                    <tr>
                        <th><?php echo Translation::getString("created"); ?></th>
                        <th><?php echo Translation::getString("by"); ?></th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: campaignEntries">
                    <tr>
                        <td><input type="button" class="link-button" data-bind="click: openEntry, value: createdOnDate" /></td>
                        <td><span data-bind="text: createdByUsername"></span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>