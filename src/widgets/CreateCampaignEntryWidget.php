<?php
class CreateCampaignEntryWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignEntryViewModel-->
        <div id="CreateCampaignEntry" data-bind="visible: showCreateCampaignEntry">
            <div class="entry-field in-list">
                <label for="FactionSelection">Faction:</label>
                <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: selectedFaction, hasFocus: factionSelectionHasFocus, optionsCaption: 'Select a faction'"></select>
            </div>
            <div class="entry-field in-list">
                <label for="UserSelection">User:</label>
                <input type="text" id="UserSelection" data-bind="jqAuto: { value: selectedUser, source: getUsers, inputProp: 'label', labelProp: 'label', valueProp: 'object' }, validationElement: selectedUser"></select>
                <span class="validationMessage" data-bind="validationMessage: selectedUser"></span>
            </div>
            <div class="entry-field in-list">
                <label for="VictoryPoints">Points:</label>
                <input type="number" id="VictoryPoints" data-bind="value: victoryPoints" />
                <span class="validationMessage" data-bind="validationMessage: factionEntries"></span>
            </div>
            <div class="button-panel in-list">
                <input type="button" data-bind="click: addFaction" value="Add Faction" class="ui-button ui-widget ui-corner-all" />
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
            <div class="button-panel">
                <input type="button" data-bind="click: saveCampaignEntry" value="Save Entry" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: back" value="Back" class="ui-button ui-widget ui-corner-all" />
            </div>
            <table class="ui-widget ui-corners-all ui-widget-content">
                <thead>
                    <tr>
                        <th>Created On</th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: campaignEntries">
                    <tr>
                        <td data-bind="text: createdOnDate" />
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>