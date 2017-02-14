<?php
class LogoutWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: logoutViewModel -->
        <input type="button" value="Logout" data-bind="click: logout, visible: showLogout" class="ui-button ui-widget ui-corner-all" />
        <!-- /ko -->
        <?php
    }
}
?>