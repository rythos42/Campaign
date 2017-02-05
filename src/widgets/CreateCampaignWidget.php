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
			<input id="CampaignName" name="CampaignName" type="text" data-bind="value: name" />
			<label for="CampaignFactionCount">Number of factions:</label>
			<input id="CampaignFactionCount" name="CampaignFactionCount" type="number" data-bind="value: numberOfFactions" />
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