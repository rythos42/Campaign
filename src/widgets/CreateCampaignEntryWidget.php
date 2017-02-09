<?php
class CreateCampaignEntryWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignEntryViewModel-->
        <div data-bind="visible: showCreateCampaignEntry">
            <div data-bind="with: createCampaignFactionEntryViewModel">
                <label for="FactionSelection">Faction:</label>
                <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: selectedFaction"></select>
                <label for="UserSelection">User:</label>
                <input type="text" id="UserSelection" data-bind="jqAuto: { value: selectedUser, source: getUsers, inputProp: 'label', labelProp: 'label', valueProp: 'object' }"></select>
                <label for="VictoryPoints">VPs:</label>
                <input type="number" id="VictoryPoints" data-bind="value: victoryPoints" />
                <input type="button" data-bind="click: addFaction" value="Add Faction" />
            </div>
            <table>
                <tbody data-bind="foreach: factionEntries">
                    <tr>
                        <td data-bind="text: factionName" />
                        <td data-bind="text: username" />
                        <td data-bind="text: victoryPoints" />
                    </tr>
                </tbody>
            </table>
            <input type="button" data-bind="click: saveCampaignEntry" value="Save Campaign Entry" />
            <input type="button" data-bind="click: back" value="Back" />
        </div>
        <!-- /ko -->
        <?php
    }
}
?>