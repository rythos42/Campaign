<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set("America/Vancouver");

include($_SERVER['DOCUMENT_ROOT'] . "/settings.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/Settings.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/ExceptionCodes.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/model/User.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/mappers/Database.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/mappers/UserMapper.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/mappers/CampaignMapper.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/IWidget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/MainWidget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/LoginWidget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/LogoutWidget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/CreateCampaignWidget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/CreateCampaignEntryWidget.php");
include($_SERVER['DOCUMENT_ROOT'] . "/src/widgets/CampaignListWidget.php");

session_start();
Database::connect();

?>