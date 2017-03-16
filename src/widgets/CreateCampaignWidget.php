<?php
class CreateCampaignWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignViewModel-->
        <div id="CreateCampaign" data-bind="visible: showCreateCampaign">
            <div data-bind="visible: showCreateCampaignEntry" class="grouping ui-widget ui-corners-all ui-widget-content">
                <ul>
                    <li class="title">
                        <?php echo Translation::getString("createCampaign"); ?>
                    </li>
                    <li class="entry-field">
                        <label for="CampaignName"><?php echo Translation::getString("name"); ?>:</label>
                        <input id="CampaignName" type="text" data-bind="value: name, hasFocus: campaignNameHasFocus" />
                    </li>
                    <li class="entry-field" data-bind="visible: canCreateMapCampaign">
                        <label for="CampaignType"><?php echo Translation::getString("type"); ?>:</label>
                        <select id="CampaignType" data-bind="value: campaignType">
                            <option value="0">Simple</option>
                            <option value="1">Map</option>
                        </select>
                    </li>
                    <li class="title">
                        <?php echo Translation::getString("factions"); ?>
                    </li>
                    <li class="entry-field">
                        <label for="CampaignFactionNameEntry"><?php echo Translation::getString("factionName"); ?>:</label>
                        <input id="CampaignFactionNameEntry" type="text" data-bind="textInput: factionNameEntry, event: {keypress: keyPressAddFaction}, hasFocus: factionNameEntryHasFocus" />
                        <span class="validationMessage" data-bind="validationMessage: factions"></span>
                    </li>
                    <li class="button-panel">
                        <input type="button" data-bind="click: addFaction" value="<?php echo Translation::getString("addFaction"); ?>" class="ui-button ui-widget ui-corner-all" />
                    </li>
                </ul>
               
                <table data-bind="visible: hasFactions" class="ui-widget ui-corner-all ui-widget-content">
                    <tbody data-bind="foreach: factions">
                        <tr>
                            <td data-bind="text: name" />
                            <td style="width: 100px" data-bind="style: { 'background-color': colour }"></td>
                            <td><button class="button-icon" data-bind="click: removeFaction"><span class="ui-icon ui-icon-trash"</span></button></td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="bottom-button-panel">
                    <button data-bind="click: back" title="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all button-icon">
                        <span class="icon-arrow-left2"></span>
                    </button>
                    <input type="button" data-bind="click: saveCampaign, value: saveCampaignButtonText" class="ui-button ui-widget ui-corner-all" />
                </div>
            </div>
            
            <?php
                $createCampaignMapWidget = new CreateCampaignMapWidget();
                $createCampaignMapWidget->render();
            ?>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>