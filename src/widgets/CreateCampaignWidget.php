<?php
class CreateCampaignWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignViewModel-->
        <div id="CreateCampaign" data-bind="visible: showCreateCampaign">
            <div class="entry-field in-list">
                <label for="CampaignName"><?php echo Translation::getString("campaignName"); ?>:</label>
                <input id="CampaignName" type="text" data-bind="value: name, hasFocus: campaignNameHasFocus" />
            </div>
            <div class="entry-field in-list">
                <label for="CampaignFactionNameEntry"><?php echo Translation::getString("factionName"); ?>:</label>
                <input id="CampaignFactionNameEntry" type="text" data-bind="textInput: factionNameEntry, event: {keypress: keyPressAddFaction}, hasFocus: factionNameEntryHasFocus" />
                <span class="validationMessage" data-bind="validationMessage: factions"></span>
            </div>
            <div class="button-panel in-list">
                <input type="button" data-bind="click: addFaction" value="<?php echo Translation::getString("addFaction"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
            
            <table data-bind="visible: hasFactions" class="ui-widget ui-corner-all ui-widget-content">
                <thead>
                    <th><span class="ui-widget-title"><?php echo Translation::getString("campaignFactions"); ?></span></th>
                    <th></th>
                </thead>
                <tbody data-bind="foreach: factions">
                    <tr>
                        <td data-bind="text: name" />
                        <td><button class="icon-button" data-bind="click: removeFaction"><span class="ui-icon ui-icon-trash"</span></button></td>
                    </tr>
                </tbody>
            </table>
            
            <div class="button-panel">
                <input type="button" data-bind="click: saveCampaign" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
                <input type="button" data-bind="click: back" value="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>