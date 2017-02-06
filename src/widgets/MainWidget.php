<?php
class MainWidget implements IWidget {
    public function render() {
        $loginWidget = new LoginWidget();
        $loginWidget->render();
        
        $logoutWidget = new LogoutWidget();
        $logoutWidget->render();
        
        $createCampaignWidget = new CreateCampaignWidget();
        $createCampaignWidget->render();
    }
}
?>