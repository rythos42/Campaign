<?php
class HeaderWidget implements IWidget {
    public function render() {
        ?>
        <div id="Header">
            <!-- ko with: logoutViewModel -->
            <input id="Logout" type="button" value="Logout" data-bind="click: logout, visible: showLogout" class="ui-button ui-widget ui-corner-all" />
            <!-- /ko -->
            <!-- ko with: createCampaignViewModel-->
            <input type="button" data-bind="click: requestCreateCampaign, visible: showCreateCampaignButton" value="Create Campaign" class="ui-button ui-widget ui-corner-all" />
            <!-- /ko -->
        </div>
        <?php
    }
}
?>