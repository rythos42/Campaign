<?php
class MainWidget implements IWidget {
    public function render() {
        $headerWidget = new HeaderWidget();
        $headerWidget->render();

        ?>
        <div id="Main">
        <?php

        $loginWidget = new LoginWidget();
        $loginWidget->render();
        
        $createCampaignWidget = new CreateCampaignWidget();
        $createCampaignWidget->render();
        
        $inProgressCampaignViewModel = new InProgressCampaignViewModel();
        $inProgressCampaignViewModel->render();
        
        $campaignListWidget = new CampaignListWidget();
        $campaignListWidget->render();
        
        ?>
        </div>
        <?php
    }
}
?>