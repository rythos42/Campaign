<?php
class EntryListWidget {
    public function render() {
        ?>
        <!-- ko with: entryListViewModel -->
        <span data-bind="visible: hasJoinedCampaign" class="radio-list">
            <label><input type="radio" data-bind="checked: entryFilter" value="All" /><?php echo Translation::getString("all"); ?></label>
            <label><input type="radio" data-bind="checked: entryFilter" value="Unfinished" /><?php echo Translation::getString("onlyUnfinished"); ?></label>
            <label><input type="radio" data-bind="checked: entryFilter" value="Finished" /><?php echo Translation::getString("onlyFinished"); ?></label>
        </span>
        <table data-bind="stupidtable: {}">
            <thead>
                <tr>
                    <th><?php echo Translation::getString("created"); ?></th>
                    <th data-sort="string"><?php echo Translation::getString("by"); ?></th>
                    <th><?php echo Translation::getString("finished"); ?></th>
                    <th data-sort="int"><?php echo Translation::getString("where"); ?></th>
                </tr>
            </thead>
            <tbody data-bind="foreach: entries">
                <tr>
                    <td>
                        <!-- ko if: hasJoinedCampaign -->
                        <input type="button" class="link-button" data-bind="click: openEntry, value: createdOnDate" />
                        <!-- /ko -->
                        <!-- ko ifnot: hasJoinedCampaign -->
                        <span data-bind="text: createdOnDate, tooltip: Translation.getString('mustFirstJoinTheCampaign')"></span>
                        <!-- /ko -->
                    </td>
                    <td data-bind="text: createdByUsername"></td>
                    <td data-bind="text: finishDate"></td>
                    <td data-bind="text: territoryBeingAttackedIdOnMap"></td>
                </tr>
            </tbody>
        </table>
        <!-- /ko -->
        <?php
    }
}
?>