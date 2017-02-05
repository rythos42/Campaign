<?php
class LoginWidget extends Widget {
	public function canRender() {
		return true;
	}
	
	public function render() {
		$render = $this->getRequest("Render");
		
		if($render == "Login" || ($render == null && !User::isLoggedIn())) {
			?>
			<form method="POST">
				<div>
					<span>Username: </span>
					<input type="text" id="Username" name="Username" />
				</div>
				<div>
					<span>Password: </span>
					<input type="password" id="Password" name="Password" />
				</div>
				<input type="hidden" name="Action" value="Login" />
				<input type="hidden" name="Render" value="" />
				<input type="submit" />
			</form>
			<form method="POST">
				<input type="hidden" name="Render" value="Register" />
				<input type="submit" value="Sign up" />
			</form>
			<?php
		}
		else if($render == "Register") {
			?>
			<form method="POST">
				<div>
					<span>Username: </span>
					<input type="text" id="Username" name="Username" />
				</div>
				<div>
					<span>Password: </span>
					<input type="password" id="Password" name="Password" />
				</div>
				<input type="hidden" name="Action" value="Register" />
				<input type="hidden" name="Render" value="Login" />
				<input type="submit" />
			</form>
			<?php
		}
		else {
			?>
			<form method="POST">
				<input type="hidden" name="Action" value="Logout" />
				<input type="submit" value="Logout" />
			</form>
			<?php
		}
	}
	
	public function canHandleAction() {
		$action = $this->getRequest("Action");
		return $action == "Login" || $action == "Register"|| $action == "Logout";
	}
	
	public function handleAction() {
		$action = $this->getRequest("Action");

		if($action == "Login") {
			$user = UserMapper::validateLogin($_POST["Username"], $_POST["Password"]);
			if($user) {
				User::setLoggedIn($user);
			}
			else {
				echo "bad login";
			}
		}
		else if($action == "Register") {
			UserMapper::insertUser($_POST["Username"], $_POST["Password"]);
			echo "User added to database.";
		}
		else if($action == "Logout") {
			User::logout();
		}
	}
}
?>