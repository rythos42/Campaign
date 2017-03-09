<?php
class CreateEntryWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createEntryViewModel-->
        <div id="CreateCampaignEntry" data-bind="visible: showCreateEntry">
            <div data-bind="visible: !showAddFactions()">
                <?php
                $entryMapWidget = new EntryMapWidget();
                $entryMapWidget->render();
                ?>
            </div>
            <div data-bind="visible: showAddFactions">
                <ul>
                    <li class="entry-field">
                        <label for="FactionSelection"><?php echo Translation::getString("faction"); ?>:</label>
                        <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: selectedFaction, hasFocus: factionSelectionHasFocus, optionsCaption: Translation.getString('selectFaction'), event: {keypress: keyPressAddFaction}"></select>
                    </li>
                    <li class="entry-field">
                        <label for="UserSelection"><?php echo Translation::getString("user"); ?>:</label>
                        <input type="text" id="UserSelection" data-bind="jqAuto: { value: selectedUser, source: UserManager.getUsers, inputProp: 'label', labelProp: 'label', valueProp: 'object' }, validationElement: selectedUser, event: {keypress: keyPressAddFaction}"></select>
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
                            <th><?php echo ucfirst(Translation::getString("points")); ?></th>
                            <th><?php echo Translation::getString("bonus"); ?></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: factionEntries">
                        <tr>
                            <td data-bind="text: factionName" />
                            <td data-bind="text: username" />
                            <td data-bind="text: victoryPoints" />
                            <td data-bind="text: territoryBonusSpent" />
                            <td class="actions">
                                <span data-bind="visible: isAttackingFaction" class="ui-icon ui-icon-flag" title="<?php echo Translation::getString("attacker"); ?>"></span>
                                <button class="icon-button" data-bind="click: removeFactionEntry" title="<?php echo Translation::getString("remove"); ?>">
                                    <span class="ui-icon ui-icon-trash"</span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="button-panel">
                <input type="button" data-bind="click: saveCampaignEntry, visible: showAddFactions" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: addFactions, visible: !showAddFactions()" value="<?php echo Translation::getString("addFactions"); ?>" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: back" value="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>