<?php
class HeaderWidget {
    public function render() {
        ?>
        <div id="Header">
            <!-- ko with: userProfileViewModel -->
            <button class="ui-button ui-widget ui-corner-all button-icon" data-bind="click: requestUserProfile, visible: showUserProfileButton, tooltip: '<?php echo Translation::getString("profile"); ?>'">
                <span class="icon-user"></span>
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