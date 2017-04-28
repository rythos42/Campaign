<?php
class UserProfileWidget {
    public function render() {
        ?>
        <!-- ko with: userProfileViewModel -->
        <div class="grouping" data-bind="visible: showUserProfile" style="display: none;">
            <ul>
                <li class="data-list">
                    <label><?php echo Translation::getString('user'); ?>:</label>
                    <span data-bind="text: username"></span>
                </li>
                <li class="entry-field">
                    <label><?php echo Translation::getString('email'); ?>:</label>
                    <input type="text" data-bind="value: email" />
                    <span class="validationMessage" data-bind="visible: noEmail"><?php echo Translation::getString("noEmailMessage"); ?></span>
                </li>
                <li class="button-panel">
                    <button data-bind="click: back, tooltip: '<?php echo Translation::getString("back"); ?>'" class="ui-button ui-widget ui-corner-all button-icon">
                        <span class="icon-arrow-left2"></span>
                    </button>
                    <button data-bind="click: save" class="ui-button ui-widget ui-corner-all"><?php echo Translation::getString("save"); ?></button>
                </li>
            </ul>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>