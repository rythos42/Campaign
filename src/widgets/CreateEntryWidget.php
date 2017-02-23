<?php
class CreateEntryWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createEntryViewModel-->
        <div id="CreateCampaignEntry" data-bind="visible: showCampaignEntry">
            <div class="entry-field in-list">
                <label for="FactionSelection"><?php echo Translation::getString("faction"); ?>:</label>
                <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: selectedFaction, hasFocus: factionSelectionHasFocus, optionsCaption: 'Select a faction', event: {keypress: keyPressAddFaction}"></select>
            </div>
            <div class="entry-field in-list">
                <label for="UserSelection"><?php echo Translation::getString("user"); ?>:</label>
                <input type="text" id="UserSelection" data-bind="jqAuto: { value: selectedUser, source: getUsers, inputProp: 'label', labelProp: 'label', valueProp: 'object' }, validationElement: selectedUser, event: {keypress: keyPressAddFaction}"></select>
                <span class="validationMessage" data-bind="validationMessage: selectedUser"></span>
            </div>
            <div class="entry-field in-list">
                <label for="VictoryPoints"><?php echo Translation::getString("victoryPoints"); ?>:</label>
                <input type="number" id="VictoryPoints" data-bind="textInput: victoryPoints, event: {keypress: keyPressAddFaction}" />
                <span class="validationMessage" data-bind="validationMessage: factionEntries"></span>
            </div>
            <div class="button-panel in-list">
                <input type="button" data-bind="click: addFaction" value="<?php echo Translation::getString("addFaction"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
            <table data-bind="visible: hasFactionEntries" class="ui-widget ui-corners-all ui-widget-content">
                <thead>
                    <tr>
                        <th><?php echo Translation::getString("factionName"); ?></th>
                        <th><?php echo Translation::getString("username"); ?></th>
                        <th><?php echo Translation::getString("victoryPoints"); ?></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: factionEntries">
                    <tr>
                        <td data-bind="text: factionName" />
                        <td data-bind="text: username" />
                        <td data-bind="text: victoryPoints" />
                        <td class="actions">
                            <span data-bind="visible: isUsersFaction" class="ui-icon ui-icon-flag" title="<?php echo Translation::getString("yourFaction"); ?>"></span>
                            <button class="icon-button" data-bind="click: removeFactionEntry" title="<?php echo Translation::getString("remove"); ?>">
                                <span class="ui-icon ui-icon-trash"</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="button-panel">
                <input type="button" data-bind="click: saveCampaignEntry" value="<?php echo Translation::getString("saveEntry"); ?>" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: back" value="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
            
            <?php
            $mapWidget = new MapWidget();
            $mapWidget->render();
            ?>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>