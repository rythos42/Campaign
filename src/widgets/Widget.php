<?php
class Widget {
	protected function getRequest($key) {
		return isset($_REQUEST[$key]) ? $_REQUEST[$key] : null;
	}
}
?>