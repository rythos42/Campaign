<?php
class HeaderWidget implements IWidget {
    public function render() {
        ?>
        <div id="Header">
            <!-- ko with: createCampaignViewModel-->
            <input type="button" data-bind="click: requestCreateCampaign, visible: showCreateCampaignButton" value="<?php echo Translation::getString("createCampaign"); ?>" class="ui-button ui-widget ui-corner-all" />
            <!-- /ko -->
            <!-- ko with: userProfileViewModel -->
            <button class="ui-button ui-widget ui-corner-all" data-bind="click: requestUserProfile, visible: showUserProfileButton" title="<?php echo Translation::getString("profile"); ?>">
                <span class="icon-user"></span>
            </button>
            <!-- /ko -->
            <!-- ko with: logoutViewModel -->
            <button class="ui-button ui-widget ui-corner-all" data-bind="click: logout, visible: showLogout" title="<?php echo Translation::getString("logout"); ?>">
                <span class="icon-exit"></span>
            </button>
            <!-- /ko -->
        </div>
        <?php
    }
}
?>