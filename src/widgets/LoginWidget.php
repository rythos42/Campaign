<?php
class LoginWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: loginViewModel -->
        <div id="Login" data-bind="visible: showLogin">
            <ul>
                <li class="entry-field">
                    <label><?php echo Translation::getString("username"); ?>:</label>
                    <input type="text" id="Username" name="Username" data-bind="textInput: username, hasFocus: usernameHasFocus, event: {keypress: keyPressLogin}" />
                </li>
                <li class="entry-field">
                    <label><?php echo Translation::getString("password"); ?>:</label>
                    <input type="password" id="Password" name="Password" data-bind="textInput: password, event: {keypress: keyPressLogin}" />
                    <span data-bind="visible: showUsernamePasswordIncorrect" class="validationMessage"><?php echo Translation::getString("usernamePasswordNotCorrect"); ?></span>
                    <span data-bind="visible: showUsernameAlreadyTaken" class="validationMessage"><?php echo Translation::getString("usernameTaken"); ?></span>
                </li>
                <li class="button-panel">
                    <input type="button" value="<?php echo Translation::getString("login"); ?>" data-bind="click: login" class="ui-button ui-widget ui-corner-all" />
                </li>
                <li class="conditional">
                    <h2><?php echo Translation::getString("or"); ?></h2>
                </li>
                <li class="entry-field">
                    <label><?php echo Translation::getString("verifyPassword"); ?>:</label>
                    <input type="password" id="VerifyPassword" name="VerifyPassword" data-bind="textInput: verifyPassword, event: {keypress: keyPressRegister}" />
                </li>
                <li class="button-panel">
                    <input type="button" value="<?php echo Translation::getString("signup"); ?>" data-bind="click: register" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
            <div class="ui-widget ui-widget-content ui-corner-all paragraph">
                <?php echo Translation::getString("loginPageAbout"); ?>
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>