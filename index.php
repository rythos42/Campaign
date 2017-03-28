<?php include("src/Header.php"); ?>

<html>
    <head>
        <title>Campaign</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.9">
        <link href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" type="text/css" rel="stylesheet" />
        <link href="https://code.jquery.com/ui/1.12.1/themes/cupertino/jquery-ui.css" type="text/css" rel="stylesheet" />
        <link href="css/jquery.dropdown.css" type="text/css" rel="stylesheet" />
        <link href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet"/>
        <link href="css/styles.css" type="text/css" rel="stylesheet" />
        <link href="css/icon-fonts.css" type="text/css" rel="stylesheet" />
        <link href="css/loading-image.css" type="text/css" rel="stylesheet" />
        <link href="css/slideout.css" type="text/css" rel="stylesheet" />
        <link href="css/mobile.css" type="text/css" rel="stylesheet" />

        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout-validation/2.0.3/knockout.validation.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>

        <script src="js/lib/knockout-jqAutocomplete.min.js"></script>
        <script src="js/lib/jquery.panzoom.js"></script>
        <script src="js/lib/DragDropTouch.js"></script>
        <script src="js/lib/jquery.dropdown.min.js"></script>

        <script src="js/app/infrastructure/ExceptionCodes.js"></script>
        <script src="js/app/infrastructure/RequireObjectValidator.js"></script>
        <script src="js/app/infrastructure/Translation.js"></script>
        <script src="js/app/infrastructure/TabCustomBinder.js"></script>
        <script src="js/app/infrastructure/AreSameValidator.js"></script>
        <script src="js/app/infrastructure/ColourHelper.js"></script>
        <script src="js/app/infrastructure/CanvasCustomBinder.js"></script>
        <script src="js/app/infrastructure/DrawPolygonOnCanvasCustomBinder.js"></script>
        <script src="js/app/infrastructure/MapHelper.js"></script>
        <script src="js/app/infrastructure/UniqueInValidator.js"></script>
        <script src="js/app/infrastructure/DialogCustomBinder.js"></script>
        <script src="js/app/infrastructure/TooltipCustomBinder.js"></script>
        <script src="js/app/infrastructure/DateTimeFormatter.js"></script>
        <script src="js/app/infrastructure/EveryFactionRequiresATerritoryValidator.js"></script>
        <script src="js/app/infrastructure/DomColourCustomBinder.js"></script>
        <script src="js/app/infrastructure/HideTooltipOnShowCustomBinder.js"></script>
        <script src="js/app/model/Campaign.js"></script>
        <script src="js/app/model/Faction.js"></script>
        <script src="js/app/model/User.js"></script>
        <script src="js/app/model/Navigation.js"></script>
        <script src="js/app/model/Entry.js"></script>
        <script src="js/app/model/FactionEntry.js"></script>
        <script src="js/app/model/Colour.js"></script>
        <script src="js/app/model/DialogResult.js"></script>
        <script src="js/app/model/CampaignType.js"></script>
        <script src="js/app/managers/UserManager.js"></script>
        <script src="js/app/viewmodels/ApplicationViewModel.js"></script>
        <script src="js/app/viewmodels/LoginViewModel.js"></script>
        <script src="js/app/viewmodels/LogoutViewModel.js"></script>
        <script src="js/app/viewmodels/CreateCampaignViewModel.js"></script>
        <script src="js/app/viewmodels/CreateEntryViewModel.js"></script>
        <script src="js/app/viewmodels/CreateFactionListItemViewModel.js"></script>
        <script src="js/app/viewmodels/CampaignListViewModel.js"></script>
        <script src="js/app/viewmodels/CampaignListItemViewModel.js"></script>
        <script src="js/app/viewmodels/EntryListItemViewModel.js"></script>
        <script src="js/app/viewmodels/EntryListViewModel.js"></script>
        <script src="js/app/viewmodels/InProgressCampaignViewModel.js"></script>
        <script src="js/app/viewmodels/FactionEntryListItemViewModel.js"></script>
        <script src="js/app/viewmodels/FactionEntrySummaryViewModel.js"></script>
        <script src="js/app/viewmodels/EntryMapViewModel.js"></script>
        <script src="js/app/viewmodels/MapLegendViewModel.js"></script>
        <script src="js/app/viewmodels/CreateCampaignMapViewModel.js"></script>
        <script src="js/app/viewmodels/UserProfileViewModel.js"></script>
        <script src="js/app/viewmodels/GiveTerritoryBonusToUserDialogViewModel.js"></script>
        <script src="js/app/viewmodels/ConfirmationDialogViewModel.js"></script>
        <script src="js/app/viewmodels/PlayerListViewModel.js"></script>
        <script src="js/app/viewmodels/PlayerListItemViewModel.js"></script>
        <script src="js/app/viewmodels/NewsListViewModel.js"></script>
        <script src="js/app/viewmodels/NewsListItemViewModel.js"></script>
        <script src="js/app/viewmodels/TextFieldDialogViewModel.js"></script>
        
        <?php Translation::loadTranslationFiles($_SERVER['DOCUMENT_ROOT'] . '/' . $settings['installDirOnWebServer'] . "/lang"); ?>
        
        <script type="text/javascript">
            (function() {var existing = ko.bindingProvider.instance;ko.bindingProvider.instance = {nodeHasBindings: existing.nodeHasBindings,getBindings: function(node, bindingContext) {var bindings;try {bindings = existing.getBindings(node, bindingContext);}catch (ex) {if (window.console && console.log) {console.log("binding error", ex.message, node, bindingContext);}}return bindings;}};})();
        
            $(document).ready(function() {
                CampaignType.setCampaignTypes(<?php echo json_encode(CampaignType::getAllCampaignTypes()); ?>);
                ExceptionCodes.setCodes(<?php echo json_encode(ExceptionCodes::getAllCodes()); ?>);
                Translation.setTranslations(<?php echo Translation::getJson(); ?>);

                var user = new User(),
                    navigation = new Navigation(user);
                    
                ko.validation.registerExtenders();
                var viewModel = new ApplicationViewModel(user, navigation);
                ko.applyBindings(viewModel, document.getElementById('Everything'));
                
                <?php 
                if(User::isLoggedIn()) {
                    UserMapper::updateLastLoginDate(User::getCurrentUser()->getId());
                    ?>
                    user.setFromJson(<?php echo json_encode(User::getCurrentUser()); ?>);
                    user.isLoggedIn(true);
                <?php } ?>
            });
        </script>
        
    </head>
    <body>
        <div id="Everything">
            <?php
            $mainWidget = new MainWidget();
            $mainWidget->render();
            ?>
        </div>
    </body>
</html>