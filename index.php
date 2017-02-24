<?php include("src/Header.php"); ?>

<html>
    <head>
        <title>Campaign</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" type="text/css" rel="stylesheet" />
        <link href="https://code.jquery.com/ui/1.12.1/themes/cupertino/jquery-ui.css" type="text/css" rel="stylesheet" />
        <link href="css/styles.css" type="text/css" rel="stylesheet" />

        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout-validation/2.0.3/knockout.validation.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
        <script src="js/app/infrastructure/ExceptionCodes.js"></script>
        <script src="js/app/infrastructure/RequireObjectValidator.js"></script>
        <script src="js/app/infrastructure/Translation.js"></script>
        <script src="js/app/infrastructure/TabCustomBinder.js"></script>
        <script src="js/app/infrastructure/AreSameValidator.js"></script>
        <script src="js/app/infrastructure/ColourHelper.js"></script>
        <script src="js/app/infrastructure/CanvasCustomBinder.js"></script>
        <script src="js/app/infrastructure/DrawPolygonOnCanvasCustomBinder.js"></script>
        <script src="js/app/infrastructure/MustContainValidator.js"></script>
        <script src="js/app/model/Campaign.js"></script>
        <script src="js/app/model/Faction.js"></script>
        <script src="js/app/model/User.js"></script>
        <script src="js/app/model/Navigation.js"></script>
        <script src="js/app/model/Entry.js"></script>
        <script src="js/app/model/FactionEntry.js"></script>
        <script src="js/app/model/Colour.js"></script>
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
        <script src="js/app/viewmodels/MapViewModel.js"></script>
        <script src="js/lib/knockout-jqAutocomplete.min.js"></script>
        
        <?php Translation::loadTranslationFiles($_SERVER['DOCUMENT_ROOT'] . '/' . $settings['installDirOnWebServer'] . "/lang"); ?>
        
        <script type="text/javascript">
            (function() {var existing = ko.bindingProvider.instance;ko.bindingProvider.instance = {nodeHasBindings: existing.nodeHasBindings,getBindings: function(node, bindingContext) {var bindings;try {bindings = existing.getBindings(node, bindingContext);}catch (ex) {if (window.console && console.log) {console.log("binding error", ex.message, node, bindingContext);}}return bindings;}};})();
        
            $(document).ready(function() {
                ExceptionCodes.setCodes(<?php echo json_encode(ExceptionCodes::getAllCodes()); ?>);
                Translation.setTranslations(<?php echo Translation::getJson(); ?>);

                var user = new User(),
                    navigation = new Navigation(user);
                    
                ko.validation.registerExtenders();
                var viewModel = new ApplicationViewModel(user, navigation);
                ko.applyBindings(viewModel);
                
                <?php if(User::isLoggedIn()) { ?>
                user.setFromJson(<?php echo json_encode(User::getCurrentUser()); ?>);
                user.isLoggedIn(true);
                <?php } ?>
            });
        </script>
        
    </head>
    <body>
        <?php
        $mainWidget = new MainWidget();
        $mainWidget->render();
        ?>
    </body>
</html>