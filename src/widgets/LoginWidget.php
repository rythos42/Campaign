<?php
class LoginWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: loginViewModel -->
        <div data-bind="visible: showLogin">
            <div>
                <span>Username: </span>
                <input type="text" id="Username" name="Username" data-bind="value: username" />
            </div>
            <div>
                <span>Password: </span>
                <input type="password" id="Password" name="Password" data-bind="value: password" />
            </div>
            <input type="button" value="Login" data-bind="click: login" />
            <input type="button" value="Sign up" data-bind="click: register" />
        </div>
        <!-- /ko -->
        <?php
    }
}
?>