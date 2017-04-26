<?php
class HeaderWidget {
    public function render() {
        ?>
        <div id="Header">
            <label data-bind="visible: showOpenSideBarButton" for="nav-trigger">
                <div class="ui-button ui-widget ui-corner-all"><?php echo Translation::getString("campaigns"); ?></div>
            </label>
            <!-- ko with: campaignListViewModel -->
            <button data-jq-dropdown="#JoinedCampaignsMenu" class="ui-button ui-widget ui-corner-all button-icon" data-bind="tooltip: '<?php echo Translation::getString("joinedCampaigns"); ?>', visible: showJoinedCampaignsButton">
                <span class="icon-star-full"></span>
            </button>
            <div id="JoinedCampaignsMenu" data-bind="hideTooltipOnShow: {}" class="ui-widget jq-dropdown jq-dropdown-tip jq-dropdown-relative">
                <ul data-bind="foreach: joinedCampaigns, visible: !noJoinedCampaigns()" class="jq-dropdown-menu">
                    <li><input type="button" data-bind="value: name, click: showInProgressCampaign" /></li>
                </ul>
                <ul data-bind="visible: noJoinedCampaigns" class="jq-dropdown-menu">
                    <li><?php echo Translation::getString("noJoinedCampaigns"); ?></li>
                </ul>
            </div>
            <!-- /ko -->
            <!-- ko with: userProfileViewModel -->
            <button class="ui-button ui-widget ui-corner-all button-icon" data-bind="click: requestUserProfile, visible: showUserProfileButton, tooltip: '<?php echo Translation::getString("profile"); ?>'">
                <span class="icon-user"></span>
                <span data-bind="visible: showProfileWarning" class="button-icon-warning-overlay"></span>
            </button>
            <!-- /ko -->
            <!-- ko with: logoutViewModel -->
            <button class="ui-button ui-widget ui-corner-all button-icon" data-bind="click: logout, visible: showLogout, tooltip: '<?php echo Translation::getString("logout"); ?>'">
                <span class="icon-exit"></span>
            </button>
            <!-- /ko -->
        </div>
        <?php
    }
}
?>