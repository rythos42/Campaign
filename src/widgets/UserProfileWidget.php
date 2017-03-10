<?php
class UserProfileWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: userProfileViewModel -->
        <div data-bind="visible: showUserProfile">
            <ul>
                <li class="data-list">
                    <label><?php echo Translation::getString('user'); ?>:</label>
                    <span data-bind="text: username"></span>
                </li>
                <li class="button-panel">
                    <button data-bind="click: back" title="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all button-icon">
                        <span class="icon-arrow-left2"></span>
                    </button>
                </li>
            </ul>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>