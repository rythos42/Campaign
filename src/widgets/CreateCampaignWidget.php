<?php
class CreateCampaignWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignViewModel-->
        <input type="button" data-bind="click: requestCreateCampaign, visible: showCreateCampaignButton" value="Create Campaign" />
        <div data-bind="visible: showCreateCampaign">       
            <label for="CampaignName">Name:</label>
            <input id="CampaignName" type="text" data-bind="value: name" />
            
            <label for="CampaignFactionNameEntry">Faction name:</label>
            <input id="CampaignFactionNameEntry" type="text" data-bind="value: factionNameEntry" />
            <input type="button" data-bind="click: addFaction" value="Add Faction" />
            
            <table>
                <tbody data-bind="foreach: factions">
                    <tr>
                        <td data-bind="text: name" />
                    </tr>
                </tbody>
            </table>
            
            <input type="button" data-bind="click: saveCampaign" value="Save" />
        </div>
        <!-- /ko -->
        <?php
    }
}
?>