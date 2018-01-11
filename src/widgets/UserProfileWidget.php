<?php
class UserProfileWidget {
    public function render() {
        ?>
        <!-- ko with: userProfileViewModel -->
        <div id="UserProfile" class="grouping" data-bind="visible: showUserProfile" style="display: none;">
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
                <li class="data-list">
                    <div class="ui-widget ui-widget-content ui-corner-all paragraph">
                        <ul>
                            <li class="entry-field">
                                <label><?php echo Translation::getString('password'); ?>:</label>
                                <input type="password" data-bind="value: password" />
                            </li>
                            <li class="entry-field">
                                <label><?php echo Translation::getString('verifyPassword'); ?>:</label>
                                <input type="password" data-bind="value: verifyPassword" />
                            </li>
                            <li class="button-panel">
                                <button data-bind="click: changePassword" class="ui-button ui-widget ui-corner-all"><?php echo Translation::getString("changePassword"); ?></button>
                            </li>
                            <li class="data-list" data-bind="visible: passwordSuccessfullyChanged">
                                <span><?php echo Translation::getString("passwordSuccessfullyChanged"); ?></span>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>