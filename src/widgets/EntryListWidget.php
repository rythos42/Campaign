<?php
class EntryListWidget {
    public function render() {
        ?>
        <!-- ko with: entryListViewModel -->
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
        <!-- /ko -->
        <?php
    }
}
?>