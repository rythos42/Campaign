<?php
class CampaignEntryListWidget {
    public function render() {
        ?>
        <!-- ko with: campaignEntryListViewModel -->
        <div data-bind="tab: {}, visible: showCampaignEntryList">
            <ul>
                <li><a href="#SummaryTab">Summary</a></li>
                <li><a href="#DetailsTab">Details</a></li>
            </ul>
            <div id="SummaryTab">
                <table class="ui-widget ui-corners-all ui-widget-content">
                    <thead>
                        <tr>
                            <th><?php echo Translation::getString("faction"); ?></th>
                            <th><?php echo Translation::getString("victoryPoints"); ?></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: factionEntrySummaries">
                        <tr>
                            <td data-bind="text: factionName" />
                            <td data-bind="text: victoryPoints" />
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
                                            <th><?php echo Translation::getString("factionName"); ?></th>
                                            <th><?php echo Translation::getString("username"); ?></th>
                                            <th><?php echo Translation::getString("victoryPoints"); ?></th>
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
                            </tr>
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