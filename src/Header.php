<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

date_default_timezone_set("America/Vancouver");

// Force HTTPS for security
if($_SERVER["HTTPS"] != "on") {
    header("Location: https://"
        . ($_SERVER["SERVER_PORT"] != "80" 
            ? $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"]
            : $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"]));
    exit();
}


include("settings.php");
// Use Server.php instead to get this value. Can't get it here because we can't load Server without it.
$installDirOnWebServer = $_SERVER['DOCUMENT_ROOT'] . '/' . $settings['installDirOnWebServer'];

include($installDirOnWebServer . "/src/infrastructure/Settings.php");
include($installDirOnWebServer . "/src/infrastructure/ExceptionCodes.php");
include($installDirOnWebServer . "/src/infrastructure/Translation.php");
include($installDirOnWebServer . "/src/infrastructure/Server.php");
include($installDirOnWebServer . "/src/model/User.php");
include($installDirOnWebServer . "/src/model/Campaign.php");
include($installDirOnWebServer . "/src/model/Faction.php");
include($installDirOnWebServer . "/src/model/Entry.php");
include($installDirOnWebServer . "/src/model/Permission.php");
include($installDirOnWebServer . "/src/model/CampaignType.php");
include($installDirOnWebServer . "/src/mappers/Database.php");
include($installDirOnWebServer . "/src/mappers/UserMapper.php");
include($installDirOnWebServer . "/src/mappers/CampaignMapper.php");
include($installDirOnWebServer . "/src/mappers/MapMapper.php");
include($installDirOnWebServer . "/src/mappers/NewsMapper.php");
include($installDirOnWebServer . "/src/widgets/MainWidget.php");
include($installDirOnWebServer . "/src/widgets/HeaderWidget.php");
include($installDirOnWebServer . "/src/widgets/LoginWidget.php");
include($installDirOnWebServer . "/src/widgets/CreateCampaignWidget.php");
include($installDirOnWebServer . "/src/widgets/CreateEntryWidget.php");
include($installDirOnWebServer . "/src/widgets/InProgressCampaignWidget.php");
include($installDirOnWebServer . "/src/widgets/EntryListWidget.php");
include($installDirOnWebServer . "/src/widgets/CampaignListWidget.php");
include($installDirOnWebServer . "/src/widgets/InProgressCampaignMapWidget.php");
include($installDirOnWebServer . "/src/widgets/CreateCampaignMapWidget.php");
include($installDirOnWebServer . "/src/widgets/UserProfileWidget.php");
include($installDirOnWebServer . "/src/widgets/GiveTerritoryBonusToUserDialogWidget.php");
include($installDirOnWebServer . "/src/widgets/LoadingImageWidget.php");
include($installDirOnWebServer . "/src/widgets/ConfirmationDialogWidget.php");
include($installDirOnWebServer . "/src/widgets/PlayerListWidget.php");
include($installDirOnWebServer . "/src/widgets/SideBarWidget.php");
include($installDirOnWebServer . "/src/widgets/NewsListWidget.php");
include($installDirOnWebServer . "/src/widgets/TextFieldDialogWidget.php");
include($installDirOnWebServer . "/src/widgets/DropDownListDialogWidget.php");
include($installDirOnWebServer . "/src/widgets/EditTerritoryDialogWidget.php");

session_start();
Database::connect();

?>