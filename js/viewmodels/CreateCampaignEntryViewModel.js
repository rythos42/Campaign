var CreateCampaignEntryViewModel = function(navigation) {
    var self = this,
		campaign = ko.observable(null);
		
	self.createCampaignFactionEntryViewModel = new CreateCampaignFactionEntryViewModel(campaign);

    self.showCreateCampaignEntry = ko.computed(function() {
        return navigation.showCreateCampaignEntry();
    });
	
	navigation.showCreateCampaignEntry.subscribe(function(show) {
		if(typeof(show) === 'object')
			campaign(show);
	});
	
	// need to get: CampaignFactionId, UserId, VictoryPointsScored multiple times -- one for each player in the game
           
    self.saveCampaignEntry = function() {
		// CampaignEntry: Id, CampaignId, CreatedByUserId, CreatedOnDate
		// CampaignFactionEntry: Id, CampaignEntryId, CampaignFactionId, UserId, VictoryPointsScored
		
        /*var params = {
            action: 'SaveCampaign',
            name: campaign.name(),
            factions: ko.toJSON(campaign.factions)
        };
        
        $.ajax({
            url: '/src/webservices/CampaignService.php',
            method: 'POST',
            data: params,
            success: function() {
                createCampaignRequested(false);
            }
        });*/
        navigation.showMain(true);
    };
};