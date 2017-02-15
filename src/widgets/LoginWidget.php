<?php
class LoginWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: loginViewModel -->
        <div id="Login" data-bind="visible: showLogin">
            <div class="entry-field in-list">
                <label>Username: </label>
                <input type="text" id="Username" name="Username" data-bind="value: username, hasFocus: usernameHasFocus" />
            </div>
            <div class="entry-field in-list">
                <label>Password: </label>
                <input type="password" id="Password" name="Password" data-bind="value: password" />
            </div>
            <div class="button-panel in-list">
                <input type="button" value="Login" data-bind="click: login" class="ui-button ui-widget ui-corner-all" />
                <input type="button" value="Sign up" data-bind="click: register" class="ui-button ui-widget ui-corner-all" />
            </div>
            <div class="ui-widget ui-widget-content ui-corner-all paragraph">
                Campaign is a simple <a href="https://github.com/rythos42/Campaign">open source</a> web app to help you manage gaming campaigns.
            </div>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>