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
        <label for="CampaignName">Name:</label>
        <input id="CampaignName" name="CampaignName" type="text" />
        <label for="CampaignFactionCount">Number of factions:</label>
        <input id="CampaignFactionCount" name="CampaignFactionCount" type="number" />
        <input type="submit" />
        <?php
	}
	
	public function canHandleAction() {
		return false;
	}
	
	public function handleAction() {
    }
}
?>