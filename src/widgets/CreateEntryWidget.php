<?php
class CreateEntryWidget {
    public function render() {
        ?>
        <!-- ko with: createEntryViewModel-->
        <div data-bind="visible: showCreateEntry" class="grouping ui-widget ui-corners-all ui-widget-content" style="display: none;" >
            <div data-bind="visible: isFinished"><?php echo Translation::getString("entryFinishedTooltip"); ?></div>
            <div data-bind="visible: !hasJoinedCampaign()"><?php echo Translation::getString("entryJoinToEdit"); ?></div>
            <div><?php echo Translation::getString("attackingTerritory"); ?> #<span data-bind="text: territoryOnMapId"></span></div>
            <div data-bind="visible: !isReadOnly()">
                <label><?php echo Translation::getString("victoryType"); ?>: </label>
                <label><input type="radio" name="InputType" value="VPs" data-bind="checked: victoryType"><?php echo Translation::getString("vps"); ?></label>
                <label><input type="radio" name="InputType" value="WLD" data-bind="checked: victoryType"><?php echo Translation::getString("wld"); ?></label>
            </div>
            <table data-bind="visible: hasFactionEntries" class="ui-widget ui-corners-all ui-widget-content">
                <thead>
                    <tr>
                        <th><?php echo Translation::getString("faction"); ?></th>
                        <th><?php echo Translation::getString("user"); ?></th>
                        <th>
                            <!-- ko if: isVPs -->
                            <?php echo Translation::getString("vps"); ?>
                            <!-- /ko-->
                            <!-- ko if: isWLD -->
                            <?php echo Translation::getString("wld"); ?>
                            <!-- /ko-->
                        </th>
                        <th data-bind="visible: isMapCampaign"><?php echo Translation::getString("bonus"); ?></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: factionEntries">
                    <tr>
                        <td data-bind="text: factionName" />
                        <td data-bind="text: username" />
                        <td>
                            <!-- ko if: isVPs -->
                            <input type="number" data-bind="textInput: victoryPoints, enable: !$parent.isReadOnly(), hasFocus: victoryPointsHasFocus" />
                            <!-- /ko-->
                            <!-- ko if: isWLD -->
                            <div data-bind="validationOptions: { insertMessages: false }">
                                <label><input type="radio" value="W" data-bind="checked: wld, attr: { name: 'WinLossDraw-' + $index() }, enable: !$parent.isReadOnly(), hasFocus: wldHasFocus"><?php echo Translation::getString("w"); ?></label>
                                <label><input type="radio" value="L" data-bind="checked: wld, attr: { name: 'WinLossDraw-' + $index() }, enable: !$parent.isReadOnly()"><?php echo Translation::getString("l"); ?></label>
                                <label><input type="radio" value="D" data-bind="checked: wld, attr: { name: 'WinLossDraw-' + $index() }, enable: !$parent.isReadOnly()"><?php echo Translation::getString("d"); ?></label>
                                <span data-bind="validationMessage: wld" class="validationMessage"></span>
                            </div>
                            <!-- /ko-->
                        </td>
                        <td data-bind="visible: $parent.isMapCampaign">
                            <input type="number" data-bind="textInput: territoryBonusSpent, enable: !$parent.isReadOnly()" />
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
                <label data-bind="visible: showAdminStuff"><input type="checkbox" data-bind="checked: currentUserWroteNarrative" />I wrote this</label>
            </div>
            <div class="bottom-button-panel">
                <button data-bind="click: back, tooltip: '<?php echo Translation::getString("back"); ?>'" class="ui-button ui-widget ui-corner-all button-icon">
                    <span class="icon-arrow-left2"></span>
                </button>
                <input type="button" data-bind="click: saveCampaignEntry, visible: !isReadOnly()" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: finish, visible: showAdminStuff" value="<?php echo Translation::getString("finish"); ?>" class="ui-button ui-widget ui-corner-all" />
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