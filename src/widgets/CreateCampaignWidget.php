<?php
class CreateCampaignWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignViewModel-->
        <div id="CreateCampaign" data-bind="visible: showCreateCampaign">
            <div class="entry-field in-list">
                <label for="CampaignName">Campaign name:</label>
                <input id="CampaignName" type="text" data-bind="value: name, hasFocus: campaignNameHasFocus" />
            </div>
            <div class="entry-field in-list">
                <label for="CampaignFactionNameEntry">Faction name:</label>
                <input id="CampaignFactionNameEntry" type="text" data-bind="value: factionNameEntry" />
            </div>
            <div class="button-panel in-list">
                <input type="button" data-bind="click: addFaction" value="Add Faction" class="ui-button ui-widget ui-corner-all" />
            </div>
            
            <table data-bind="visible: hasFactions" class="ui-widget ui-corner-all ui-widget-content">
                <thead>
                    <th><span class="ui-widget-title">Campaign Factions</span></th>
                </thead>
                <tbody data-bind="foreach: factions">
                    <tr>
                        <td data-bind="text: name" />
                    </tr>
                </tbody>
            </table>
            
            <div class="button-panel">
                <input type="button" data-bind="click: saveCampaign" value="Save" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: back" value="Back" class="ui-button ui-widget ui-corner-all" />
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>