<?php
class CreateCampaignEntryWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignEntryViewModel-->
        <div id="CreateCampaignEntry" data-bind="visible: showCreateCampaignEntry">
            <div data-bind="with: createCampaignFactionEntryViewModel">
                <div class="entry-field in-list">
                    <label for="FactionSelection">Faction:</label>
                    <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: selectedFaction"></select>
                </div>
                <div class="entry-field in-list">
                    <label for="UserSelection">User:</label>
                    <input type="text" id="UserSelection" data-bind="jqAuto: { value: selectedUser, source: getUsers, inputProp: 'label', labelProp: 'label', valueProp: 'object' }, validationElement: selectedUser"></select>
                    <span class="validationMessage" data-bind="validationMessage: selectedUser"></span>
                </div>
                <div class="entry-field in-list">
                    <label for="VictoryPoints">Points:</label>
                    <input type="number" id="VictoryPoints" data-bind="value: victoryPoints" />
                </div>
                <div class="button-panel in-list">
                    <input type="button" data-bind="click: addFaction" value="Add Faction" class="ui-button ui-widget ui-corner-all" />
                </div>
            </div>
            <table data-bind="visible: hasFactionEntries" class="ui-widget ui-corners-all ui-widget-content">
                <thead>
                    <tr>
                        <th>Faction name</th>
                        <th>User name</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: factionEntries">
                    <tr>
                        <td data-bind="text: factionName" />
                        <td data-bind="text: username" />
                        <td data-bind="text: victoryPoints" />
                    </tr>
                </tbody>
            </table>
            <input type="button" data-bind="click: saveCampaignEntry" value="Save Entry" class="ui-button ui-widget ui-corner-all" />
            <input type="button" data-bind="click: back" value="Back" class="ui-button ui-widget ui-corner-all" />
        </div>
        <!-- /ko -->
        <?php
    }
}
?>