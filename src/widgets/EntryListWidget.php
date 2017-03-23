<?php
class EntryListWidget {
    public function render() {
        ?>
        <!-- ko with: entryListViewModel -->
        <div data-bind="tab: {}, visible: showEntryList" class="ui-widget ui-corners-all ui-widget-content">
            <ul>
                <li><a href="#EntriesTab"><?php echo Translation::getString("entries"); ?></a></li>
                <li><a href="#PlayersTab"><?php echo Translation::getString("players"); ?></a></li>
            </ul>
            <div id="EntriesTab">
                <label><input type="checkbox" data-bind="checked: onlyEntriesWithoutOpponent" />Only those without opponent</label>
                <table>
                    <thead>
                        <tr>
                            <th><?php echo Translation::getString("created"); ?></th>
                            <th><?php echo Translation::getString("by"); ?></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: entries">
                        <tr>
                            <td>
                                <!-- ko if: joinedCampaign -->
                                <input type="button" class="link-button" data-bind="click: openEntry, value: createdOnDate" />
                                <!-- /ko -->
                                <!-- ko ifnot: joinedCampaign -->
                                <span data-bind="text: createdOnDate, tooltip: Translation.getString('mustFirstJoinTheCampaign')"></span>
                                <!-- /ko -->
                            </td>
                            <td><span data-bind="text: createdByUsername"></span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="PlayersTab">
                <table>
                    <thead>
                        <th><?php echo Translation::getString("name"); ?></th>
                        <th><?php echo Translation::getString("attacks"); ?></th>
                    </thead>
                    <tbody data-bind="foreach: players">
                        <tr>
                            <td data-bind="text: username" />
                            <td data-bind="text: attacks" />
                        <tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>