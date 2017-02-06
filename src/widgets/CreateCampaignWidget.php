<?php
class CreateCampaignWidget extends Widget {
    public function canRender() {
		$render = $this->getRequest("Render");
		return 
			User::isLoggedIn()
			&& ($render == "CreateCampaign" || $render == "");
	}
	
	public function render() {
		?>
		<div data-bind="with: createCampaignViewModel">		
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
		<?php
	}
	
	public function canHandleAction() {
		return false;
	}
	
	public function handleAction() {
    }
}
?>