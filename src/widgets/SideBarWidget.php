<?php
class SideBarWidget {
    public function render() {
        ?>
        <div id="SideBar" class="ui-widget ui-corners-all ui-widget-content">
            <!-- ko with: createCampaignViewModel-->
            <div class="top-button-panel">
                <input type="button" data-bind="click: requestCreateCampaign, visible: showCreateCampaignButton" value="<?php echo Translation::getString("createCampaign"); ?>" class="ui-button ui-widget ui-corner-all" />
            </div>
            <!-- /ko -->

            <?php
                $campaignListWidget = new CampaignListWidget();
                $campaignListWidget->render();
            ?>
        </div>
        <input type="checkbox" id="nav-trigger" class="nav-trigger" />
        <label for="nav-trigger">
            <div class="ui-button ui-widget ui-corner-all"><?php echo Translation::getString("campaigns"); ?></div>
        </label>
        
        <?php
    }
}
?>