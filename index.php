<?php
session_start();

include("src/model/User.php");
include("src/mappers/Database.php");
include("src/mappers/UserMapper.php");
include("src/widgets/Widget.php");
include("src/widgets/LoginWidget.php");

$login = new LoginWidget();
if($login->canHandleAction()) {
	$login->handleAction();
}

if($login->canRender()) {
	$login->render();
}

if(User::isLoggedIn()) {
	?>
	You logged in!
	<?php
}
?>
