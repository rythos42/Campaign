<?php
class MainWidget {
    public function render() {
        $headerWidget = new HeaderWidget();
        $headerWidget->render();

        $sideBarWidget = new SideBarWidget();
        $sideBarWidget->render();
        
        ?>
        <div id="Main">
        <?php

        $loginWidget = new LoginWidget();
        $loginWidget->render();
        
        $newsWidget = new NewsWidget();
        $newsWidget->render();
        
        $userProfileWidget = new UserProfileWidget();
        $userProfileWidget->render();
        
        $createCampaignWidget = new CreateCampaignWidget();
        $createCampaignWidget->render();
        
        $inProgressCampaignViewModel = new InProgressCampaignViewModel();
        $inProgressCampaignViewModel->render();
        
        $helpWidget = new HelpWidget();
        $helpWidget->render();
               
        ?>
        </div>
        <?php
    }
}
?>