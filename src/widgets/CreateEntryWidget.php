<?php
class CreateEntryWidget {
    public function render() {
        ?>
        <!-- ko with: createEntryViewModel-->
        <div data-bind="visible: showCreateEntry" class="grouping ui-widget ui-corners-all ui-widget-content" style="display: none;" >
            <div data-bind="visible: isFinished"><?php echo Translation::getString("entryFinishedTooltip"); ?></div>
            <div data-bind="visible: !hasJoinedCampaign()"><?php echo Translation::getString("entryJoinToEdit"); ?></div>
            <table data-bind="visible: hasFactionEntries" class="ui-widget ui-corners-all ui-widget-content">
                <thead>
                    <tr>
                        <th><?php echo Translation::getString("faction"); ?></th>
                        <th><?php echo Translation::getString("user"); ?></th>
                        <th><?php echo Translation::getString("vps"); ?></th>
                        <th data-bind="visible: isMapCampaign"><?php echo Translation::getString("bonus"); ?></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: factionEntries">
                    <tr>
                        <td data-bind="text: factionName" />
                        <td data-bind="text: username" />
                        <td>
                            <input type="number" data-bind="textInput: victoryPoints" />
                        </td>
                        <td data-bind="visible: $parent.isMapCampaign">
                            <input type="number" data-bind="textInput: territoryBonusSpent" />
                        </td>
                        <td class="actions">
                            <span data-bind="visible: isAttackingUser, tooltip: '<?php echo Translation::getString("attacker"); ?>'" class="icon-flag"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                <label for="EntryNew"><?php echo Translation::getString('narrative'); ?></label>
                <textarea data-bind="enable: !isReadOnly(), value: narrative"></textarea>
            </div>
            <div class="bottom-button-panel">
                <button data-bind="click: back, tooltip: '<?php echo Translation::getString("back"); ?>'" class="ui-button ui-widget ui-corner-all button-icon">
                    <span class="icon-arrow-left2"></span>
                </button>
                <input type="button" data-bind="click: saveCampaignEntry, visible: !isReadOnly()" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: finish, visible: showFinishButton" value="<?php echo Translation::getString("finish"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
            <!-- ko with: confirmFinishDialogViewModel -->
            <?php
            $confirmFinishDialogWidget = new ConfirmationDialogWidget();
            $confirmFinishDialogWidget->render(
                Translation::getString('finishEntryTitle'),
                Translation::getString('youWillBeUnableToEditAfterFinishing'),
                Translation::getString('finish'),
                Translation::getString('doNotFinish')
            );
            ?>
            <!-- /ko -->
        </div>
        <!-- /ko -->
        <?php
    }
}
?>