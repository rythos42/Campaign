<?php include("src/Header.php"); ?>

<html>
    <head>
        <title>Campaign</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js"></script>
        <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
        <script src="js/model/Campaign.js"></script>
        <script src="js/model/Faction.js"></script>
        <script src="js/model/User.js"></script>
        <script src="js/model/Navigation.js"></script>
        <script src="js/viewmodels/ApplicationViewModel.js"></script>
        <script src="js/viewmodels/LoginViewModel.js"></script>
        <script src="js/viewmodels/LogoutViewModel.js"></script>
        <script src="js/viewmodels/CreateCampaignViewModel.js"></script>
        <script src="js/viewmodels/CreateCampaignEntryViewModel.js"></script>
        <script src="js/viewmodels/CampaignFactionListItemViewModel.js"></script>
        <script src="js/viewmodels/CreateCampaignFactionEntryViewModel.js"></script>
        <script src="js/viewmodels/CampaignListViewModel.js"></script>
        <script src="js/viewmodels/CampaignListItemViewModel.js"></script>
        
        <script type="text/javascript">
		    (function() {
			  var existing = ko.bindingProvider.instance;

				ko.bindingProvider.instance = {
					nodeHasBindings: existing.nodeHasBindings,
					getBindings: function(node, bindingContext) {
						var bindings;
						try {
						   bindings = existing.getBindings(node, bindingContext);
						}
						catch (ex) {
						   if (window.console && console.log) {
							   console.log("binding error", ex.message, node, bindingContext);
						   }
						}

						return bindings;
					}
				};

			})();
		
		
            $(document).ready(function() {
                var user = new User(),
                    navigation = new Navigation(user);
                    
                user.isLoggedIn(<?php echo User::isLoggedIn() ? 'true' : 'false'; ?>);
                    
                var viewModel = new ApplicationViewModel(user, navigation);
                ko.applyBindings(viewModel);
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

<?php include("src/Footer.php"); ?>