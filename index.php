<?php include("src/Header.php"); ?>

<html>
	<head>
		<title>Campaign</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js"></script>
		<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
		<script src="js/model/Campaign.js"></script>
		<script src="js/model/Faction.js"></script>
		<script src="js/viewmodels/ApplicationViewModel.js"></script>
		<script src="js/viewmodels/CreateCampaignViewModel.js"></script>
		<script src="js/viewmodels/CampaignFactionListItemViewModel.js"></script>
		
		<script type="text/javascript">
			$(document).ready(function() {
				var campaign = new Campaign();
				var viewModel = new ApplicationViewModel(campaign);
				ko.applyBindings(viewModel);
			});
		</script>
		
	</head>
	<body>
		<?php

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
		?>
	</body>
</html>

<?php include("src/Footer.php"); ?>