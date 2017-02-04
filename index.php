<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

include("src/model/User.php");
include("src/mappers/Database.php");
include("src/mappers/UserMapper.php");
include("src/widgets/IWidget.php");
include("src/widgets/Widget.php");
include("src/widgets/LoginWidget.php");
include("src/widgets/CreateCampaignWidget.php");

Database::connect();

$widgetNames = Widget::getWidgetClassNames();

foreach($widgetNames as $widgetName) {
    $widget = new $widgetName();
    if($widget->canHandleAction()) {
        $widget->handleAction();
    }

    if($widget->canRender()) {
        $widget->render();
    }
}

Database::close();

?>
