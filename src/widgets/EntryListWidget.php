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
                <table>
                    <thead>
                        <tr>
                            <th><?php echo Translation::getString("created"); ?></th>
                            <th><?php echo Translation::getString("by"); ?></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: campaignEntries">
                        <tr>
                            <td>
                                <!-- ko if: finished -->
                                <span data-bind="text: createdOnDate, tooltip: Translation.getString('entryFinishedTooltip')"></span>
                                <!-- /ko -->
                                <!-- ko ifnot: finished -->
                                <input type="button" class="link-button" data-bind="click: openEntry, value: createdOnDate" />
                                <!-- /ko -->
                            </td>
                            <td><span data-bind="text: createdByUsername"></span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="DetailsTab">
                <table>
                    <thead>
                        <tr>
                            <th><?php echo Translation::getString("created"); ?></th>
                            <th><?php echo Translation::getString("faction"); ?></th>
                            <th><?php echo Translation::getString("user"); ?></th>
                            <th><?php echo Translation::getString("vps"); ?></th>
                            <th><?php echo Translation::getString("bonus"); ?></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: campaignEntries">
                        <tr>
                            <td data-bind="text: createdOnDate, attr: {'rowspan': factionEntryCount}"></td>
                            <!-- ko with: firstFactionEntry -->
                            <td data-bind="text: factionName"></td>
                            <td data-bind="text: username"></td>
                            <td data-bind="text: victoryPoints"></td>
                            <td data-bind="text: territoryBonusSpent"></td>
                            <!-- /ko -->
                        </tr>
                        <!-- ko foreach: restOfFactionEntries -->
                        <tr>
                            <td data-bind="text: factionName"></td>
                            <td data-bind="text: username"></td>
                            <td data-bind="text: victoryPoints"></td>
                            <td data-bind="text: territoryBonusSpent"></td>
                        </tr>
                        <!-- /ko -->
                    </tbody>
                </table>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>