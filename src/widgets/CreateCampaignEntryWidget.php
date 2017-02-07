<?php
class CreateCampaignEntryWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: createCampaignEntryViewModel-->
        <div data-bind="visible: showCreateCampaignEntry">
			<div data-bind="with: createCampaignFactionEntryViewModel">
				<label for="FactionSelection">Faction:</label>
				<select id="FactionSelection" data-bind="options: factions, optionsText: 'name', value: selectedFaction"></select>
			</div>
            <input type="button" data-bind="click: saveCampaignEntry" value="Save Campaign Entry" />
        </div>
        <!-- /ko -->
        <?php
    }
}
?>