<?php
class EntryListWidget {
    public function render() {
        ?>
        <!-- ko with: entryListViewModel -->
        <div data-bind="tab: {}, visible: showCampaignEntryList">
            <ul>
                <li><a href="#SummaryTab"><?php echo Translation::getString("entries"); ?></a></li>
                <li><a href="#DetailsTab"><?php echo Translation::getString("details"); ?></a></li>
            </ul>
            <div id="SummaryTab">
                <table class="ui-widget ui-corners-all ui-widget-content">
                    <thead>
                        <tr>
                            <th><?php echo Translation::getString("createdOn"); ?></th>
                            <th><?php echo Translation::getString("createdBy"); ?></th>
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
            <div id="DetailsTab">
                <table class="ui-widget ui-corners-all ui-widget-content">
                    <thead>
                        <tr>
                            <th><?php echo Translation::getString("createdOn"); ?></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: campaignEntries">
                        <tr>
                            <td data-bind="text: createdOnDate" />
                            <td>
                                <table class="ui-widget ui-corners-all ui-widget-content">
                                    <thead>
                                        <tr>
                                            <th><?php echo Translation::getString("faction"); ?></th>
                                            <th><?php echo Translation::getString("user"); ?></th>
                                            <th><?php echo ucfirst(Translation::getString("points")); ?></th>
                                        </tr>
                                    </thead>
                                    <tbody data-bind="foreach: factionEntries">
                                        <tr>
                                            <td data-bind="text: factionName" />
                                            <td data-bind="text: username" />
                                            <td data-bind="text: victoryPoints" />
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>