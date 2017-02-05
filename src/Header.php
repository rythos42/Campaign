<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set("America/Vancouver");

include($_SERVER['DOCUMENT_ROOT'] . "/src/model/User.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/mappers/Database.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/mappers/UserMapper.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/mappers/CampaignMapper.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/IWidget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/Widget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/LoginWidget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/CreateCampaignWidget.php");

session_start();
Database::connect();

?>