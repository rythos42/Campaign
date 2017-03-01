<?php
class UserProfileWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: userProfileViewModel -->
        <div data-bind="visible: showUserProfile">
            <ul>
                <li class="data-list">
                    <label><?php echo Translation::getString('username'); ?>:</label>
                    <span data-bind="text: username"></span>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('territoryBonus'); ?>:</label>
                    <span data-bind="text: territoryBonus"></span>
                </li>
                <li class="button-panel">
                    <input type="button" data-bind="click: back" value="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>