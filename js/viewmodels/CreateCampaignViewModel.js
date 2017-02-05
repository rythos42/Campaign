var CreateCampaignViewModel = function(campaign) {
	var self = this;
	
	self.name = campaign.name;
	self.numberOfFactions = campaign.numberOfFactions;
	
	self.saveCampaign = function() {
		var params = {
			action: 'SaveCampaign',
			name: self.name(),
			numberOfFactions: self.numberOfFactions()
		};
		
		$.ajax({
			url: '/src/webservices/CampaignService.php',
			data: params
		});
	};
}