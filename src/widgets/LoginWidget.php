<?php
class LoginWidget extends Widget {
	public function canRender() {
		$render = $this->getRequest("Render");
		return 
			!User::isLoggedIn()
			|| $render == "Login" || $render = "Register";
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
		return $action == "Login" || $render = "Register"|| $render = "Logout";
	}
	
	public function handleAction() {
		$action = $this->getRequest("Action");

		if($action == "Login") {
			if($this->isValid($_POST["Username"], $_POST["Password"])) {
				User::setLoggedIn();
			}
			else {
				echo "bad login";
			}
		}
		else if($action == "Register") {
			$this->addUserToDatabase($_POST["Username"], $_POST["Password"]);
			echo "User added to database.";
		}
		else if($action == "Logout") {
			User::Logout();
		}
	}
		
	private function isValid($username, $password) {
		return $username == "c" && $password = "c";
	}
	
	private function addUserToDatabase($username, $password) {
	}
}
?>