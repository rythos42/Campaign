<?php
class CreateEntryWidget {
    public function render() {
        ?>
        <!-- ko with: createEntryViewModel-->
        <div data-bind="visible: showCreateEntry" class="grouping ui-widget ui-corners-all ui-widget-content">
            <div data-bind="visible: isReadOnly"><?php echo Translation::getString("entryFinishedTooltip"); ?></div>
            <ul data-bind="visible: !isReadOnly()">
                <li class="entry-field">
                    <label for="FactionSelection"><?php echo Translation::getString("faction"); ?>:</label>
                    <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: selectedFaction, hasFocus: factionSelectionHasFocus, optionsCaption: Translation.getString('selectFaction'), event: {keypress: keyPressAddFaction}, enable: isNotAttacker"></select>
                </li>
                <li class="entry-field">
                    <label for="UserSelection"><?php echo Translation::getString("user"); ?>:</label>
                    <input type="text" id="UserSelection" data-bind="jqAuto: { value: selectedUser, source: getUsers, labelProp: 'name' }, validationElement: selectedUser, event: {keypress: keyPressAddFaction}, enable: isNotAttacker"></select>
                    <span class="validationMessage" data-bind="validationMessage: selectedUser"></span>
                </li>
                <li class="entry-field">
                    <label for="VictoryPoints"><?php echo Translation::getString("victoryPoints"); ?>:</label>
                    <input type="number" id="VictoryPoints" data-bind="textInput: victoryPoints, event: {keypress: keyPressAddFaction}" />
                </li>
                <li class="entry-field" data-bind="visible: isMapCampaign">
                    <label for="TerritoryBonusSpent"><?php echo Translation::getString("territoryBonusSpent"); ?>:</label>
                    <input type="number" id="TerritoryBonusSpent" data-bind="textInput: territoryBonusSpent, event: {keypress: keyPressAddFaction}" />
                </li>
                <li class="button-panel">
                    <span class="validationMessage" data-bind="validationMessage: factionEntries"></span>
                    <input type="button" data-bind="click: addFaction" value="<?php echo Translation::getString("addFaction"); ?>" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
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
                        <td data-bind="text: victoryPoints" />
                        <td data-bind="text: territoryBonusSpent, visible: $parent.isMapCampaign" />
                        <td class="actions">
                            <span data-bind="visible: isAttackingFaction, tooltip: '<?php echo Translation::getString("attacker"); ?>'" class="icon-flag"></span>
                            <button class="button-icon" data-bind="click: removeFactionEntry, tooltip: '<?php echo Translation::getString("remove"); ?>', visible: !$parent.isReadOnly()">
                                <span class="icon-bin"</span>
                            </button>
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