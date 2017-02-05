var ApplicationViewModel = function(campaign) {
	var self = this;
	
	self.createCampaignViewModel = new CreateCampaignViewModel(campaign);
}