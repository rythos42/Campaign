<?php include("src/Header.php"); ?><html>    <head>        <title>Campaign</title>        <meta name="viewport" content="width=device-width, initial-scale=0.9, maximum-scale=0.9, user-scalable=no">        <link href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" type="text/css" rel="stylesheet">        <link href="https://code.jquery.com/ui/1.12.1/themes/cupertino/jquery-ui.css" type="text/css" rel="stylesheet">        <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet">        <link href="css/icomoon.css" type="text/css" rel="stylesheet">        <link href="min/?g=css" type="text/css" rel="stylesheet">        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js"></script>        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout-validation/2.0.3/knockout.validation.min.js"></script>        <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>        <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>        <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script>        <script src="min/?g=app"></script>        <script src="min/?g=lib"></script>        <?php Translation::loadTranslationFiles(Server::getFullPath() . "/lang"); ?>        <script type="text/javascript">            (function() {var existing = ko.bindingProvider.instance;ko.bindingProvider.instance = {nodeHasBindings: existing.nodeHasBindings,getBindings: function(node, bindingContext) {var bindings;try {bindings = existing.getBindings(node, bindingContext);}catch (ex) {if (window.console && console.log) {console.log("binding error", ex.message, node, bindingContext);}}return bindings;}};})();            $(document).ready(function() {                CampaignType.setCampaignTypes(<?php echo json_encode(CampaignType::getAllCampaignTypes()); ?>);                ExceptionCodes.setCodes(<?php echo json_encode(ExceptionCodes::getAllCodes()); ?>);                Translation.setTranslations(<?php echo Translation::getJson(); ?>);                var user = new User(),                    navigation = new Navigation(user);                <?php                 if(User::isLoggedIn()) {                    UserMapper::updateLastLoginDate(User::getCurrentUser()->getId());                    ?>                    user.setFromJson(<?php echo json_encode(User::getCurrentUser()); ?>);                    user.isLoggedIn(true);                <?php } ?>                ko.validation.registerExtenders();                                <?php                if(Settings::getOneSignalAppId() && Settings::getOneSignalRestApiKey()) {                    ?>                    var OneSignal = window.OneSignal || [];                    OneSignal.push(["init", {                        appId: '<?php echo Settings::getOneSignalAppId(); ?>',                        autoRegister: false,                        welcomeNotification: {                            disable: true                        },                        notifyButton: {                            enable: true,                            colors: {                                'circle.background': 'rgb(84,110,123)',                                'circle.foreground': 'white',                                'badge.background': 'rgb(84,110,123)',                                'badge.foreground': 'white',                                'badge.bordercolor': 'white',                                'pulse.color': 'white',                                'dialog.button.background.hovering': 'rgb(77, 101, 113)',                                'dialog.button.background.active': 'rgb(70, 92, 103)',                                'dialog.button.background': 'rgb(84,110,123)',                                'dialog.button.foreground': 'white'                            },                            text: {                                'tip.state.unsubscribed': Translation.getString('subscribeToCampaignChanges'),                                'tip.state.subscribed': Translation.getString('youAreSubscribed'),                                'message.prenotify': Translation.getString('clickToSubscribe'),                                'message.action.resubscribed': Translation.getString('youAreSubscribed'),                                'message.action.subscribed': Translation.getString('youAreSubscribed'),                                'dialog.main.title': Translation.getString('manageSubscriptions'),                            }                        },                        allowLocalhostAsSecureOrigin: true,                        notificationClickHandlerMatch: 'origin',                        notificationClickHandlerAction: 'focus'                    }]);                    PushManager.serverHasPushEnabled(true);                    PushManager.setPushUserIdOnSubscriptionChange();                    <?php                }                ?>                                var viewModel = new ApplicationViewModel(user, navigation);                ko.applyBindings(viewModel, document.getElementById('Everything'));            });        </script>        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">        <link rel="manifest" href="manifest.json">        <link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5">        <meta name="theme-color" content="#ffffff">    </head>    <body>        <div id="Everything">            <?php            $mainWidget = new MainWidget();            $mainWidget->render();            ?>        </div>    </body></html>