<?php
class EntryListWidget {
    public function render() {
        ?>
        <!-- ko with: entryListViewModel -->
        <label data-bind="visible: joinedCampaign">
            <input type="checkbox" data-bind="checked: onlyEntriesWithoutOpponent" />
            <span><?php echo Translation::getString("onlyWithoutOpponent"); ?></span>
        </label>
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
        <!-- /ko -->
        <?php
    }
}
?>