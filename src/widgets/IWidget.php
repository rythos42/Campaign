<?php
interface IWidget {
    public function canRender();
	public function render();
	public function canHandleAction();
	public function handleAction();
}
?>