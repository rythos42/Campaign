<?php
class LoginWidget {
    public function render() {
        ?>
        <!-- ko with: loginViewModel -->
        <div class="grouping" style="display: none;" data-bind="visible: showLogin">
            <ul>
                <li class="entry-field" data-bind="visible: isLogin() || isSignup() || isForgotPassword()">
                    <label><?php echo Translation::getString("user"); ?>:</label>
                    <input type="text" id="Username" name="Username" data-bind="textInput: username, hasFocus: usernameHasFocus, onEnter: login" />
                    <span data-bind="visible: showUsernameAlreadyTaken" class="validationMessage"><?php echo Translation::getString("usernameTaken"); ?></span>
                </li>
                <li class="entry-field" data-bind="visible: isLogin() || isSignup()">
                    <label><?php echo Translation::getString("password"); ?>:</label>
                    <input type="password" id="Password" name="Password" data-bind="textInput: password, onEnter: login" />
                    <span data-bind="visible: showUsernamePasswordIncorrect" class="validationMessage"><?php echo Translation::getString("usernamePasswordNotCorrect"); ?></span>
                    <input type="button" value="<?php echo Translation::getString("forgotPassword"); ?>" data-bind="click: requestForgotPassword, visible: isLogin" class="link-button" />
                </li>
                <li class="entry-field" data-bind="visible: isSignup">
                    <label><?php echo Translation::getString("verifyPassword"); ?>:</label>
                    <input type="password" id="VerifyPassword" name="VerifyPassword" data-bind="textInput: verifyPassword, onEnter: register" />
                </li>
                <li class="data-list validationMessage" data-bind="visible: showForgotPasswordIncorrect">
                    <span><?php echo Translation::getString("forgotPasswordError"); ?></span>
                </li>
                <li class="data-list" data-bind="visible: isForgotPasswordSuccess">
                    <span><?php echo Translation::getString("forgotPasswordSuccess"); ?></span>
                </li>
                <li class="button-panel">
                    <input type="button" value="<?php echo Translation::getString("forgotPassword"); ?>" data-bind="click: forgotPassword, visible: isForgotPassword" class="ui-button ui-widget ui-corner-all" />
                    <input type="button" value="<?php echo Translation::getString("login"); ?>" data-bind="click: login, visible: isLogin" class="ui-button ui-widget ui-corner-all" />
                    <input type="button" value="<?php echo Translation::getString("signup"); ?>" data-bind="click: requestSignup, visible: isLogin() || isForgotPassword()" class="link-button" />
                    <input type="button" value="<?php echo Translation::getString("login"); ?>" data-bind="click: requestLogin, visible: isSignup() || isForgotPassword() || isForgotPasswordSuccess()" class="link-button" />
                    <input type="button" value="<?php echo Translation::getString("signup"); ?>" data-bind="click: register, visible: isSignup" class="ui-button ui-widget ui-corner-all" />
                </li>
                <li class="data-list">
                    <div class="ui-widget ui-widget-content ui-corner-all paragraph">
                        <?php echo Translation::getString("loginPageAbout"); ?>
                    </div>
                </li>
            </ul>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>