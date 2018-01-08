<?php
class HeaderWidget {
    public function render() {
        ?>
        <div id="Header">
            <label data-bind="visible: showOpenSideBarButton" for="nav-trigger" style="display: none;">
                <div class="ui-button ui-widget ui-corner-all"><?php echo Translation::getString("campaigns"); ?></div>
            </label>
            <!-- ko with: campaignListViewModel -->
            <button data-jq-dropdown="#JoinedCampaignsMenu" class="ui-button ui-widget ui-corner-all button-icon" data-bind="tooltip: '<?php echo Translation::getString("joinedCampaigns"); ?>', visible: showJoinedCampaignsButton" style="display: none;">
                <span class="icon-star-full"></span>
            </button>
            <div id="JoinedCampaignsMenu" data-bind="hideTooltipOnShow: {}" class="ui-widget jq-dropdown jq-dropdown-tip jq-dropdown-relative" style="display: none;">
                <ul data-bind="foreach: joinedCampaigns, visible: !noJoinedCampaigns()" class="jq-dropdown-menu">
                    <li><input type="button" data-bind="value: name, click: showInProgressCampaign" /></li>
                </ul>
                <ul data-bind="visible: noJoinedCampaigns" class="jq-dropdown-menu">
                    <li><?php echo Translation::getString("noJoinedCampaigns"); ?></li>
                </ul>
            </div>
            <!-- /ko -->
            <!-- ko with: userProfileViewModel -->
            <button class="ui-button ui-widget ui-corner-all button-icon" data-bind="click: requestUserProfile, visible: showUserProfileButton, tooltip: '<?php echo Translation::getString("profile"); ?>'" style="display: none;">
                <span class="icon-user"></span>
                <span data-bind="visible: showProfileWarning" class="button-icon-warning-overlay"></span>
            </button>
            <!-- /ko -->
            <!-- ko with: logoutViewModel -->
            <button class="ui-button ui-widget ui-corner-all button-icon" data-bind="click: logout, visible: showLogout, tooltip: '<?php echo Translation::getString("logout"); ?>'" style="display: none;">
                <span class="icon-exit"></span>
            </button>
            <!-- /ko -->
            <!-- ko with: helpViewModel -->
            <button data-jq-dropdown="#HelpMenu" class="ui-button ui-widget ui-corner-all button-icon" data-bind="tooltip: '<?php echo Translation::getString("help"); ?>'">
                <span class="icon-question"></span>
            </button>
            <div id="HelpMenu" data-bind="hideTooltipOnShow: {}" class="ui-widget jq-dropdown jq-dropdown-tip jq-dropdown-relative" style="display: none;">
                <ul class="jq-dropdown-menu">
                    <li><input type="button" data-bind="click: showContactUs" value="<?php echo Translation::getString("contactUs"); ?>" /></li>
                </ul>
            </div>
                <!-- ko with: contactUsViewModel -->
                <?php
                    $contactUsDialogWidget = new SimpleTextDialogWidget();
                    $contactUsDialogWidget->render(
                        Translation::getString("contactUs"),
                        Translation::getString("contactUsDialogText"),
                        Translation::getString("ok")
                    );
                ?>
                <!-- /ko -->
            <!-- /ko -->
        </div>
        <?php
    }
}
?>