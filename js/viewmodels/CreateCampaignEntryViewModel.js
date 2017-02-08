var CreateCampaignEntryViewModel = function(navigation) {
    var self = this,
        campaign = ko.observable(null),
        currentCampaignEntry = new CampaignEntry();
        
    self.createCampaignFactionEntryViewModel = new CreateCampaignFactionEntryViewModel(campaign, currentCampaignEntry);

    self.showCreateCampaignEntry = ko.computed(function() {
        return navigation.showCreateCampaignEntry();
    });
    
    self.factionEntries = ko.computed(function() {
        return $.map(currentCampaignEntry.factionEntries(), function(factionEntry) {
            return new CampaignFactionEntryListItemViewModel(factionEntry);
        });
    });
    
    navigation.showCreateCampaignEntry.subscribe(function(show) {
        currentCampaignEntry.clear();
        self.createCampaignFactionEntryViewModel.clearEntry();

        if(typeof(show) === 'object') {
            campaign(show);
            currentCampaignEntry.campaignId(show.id());
        }
    });
    
    self.saveCampaignEntry = function() {
        var params = {
            action: 'SaveCampaignEntry',
            campaignEntry: ko.toJSON(currentCampaignEntry)
        };
        
        $.ajax({
            url: '/src/webservices/CampaignService.php',
            method: 'POST',
            data: params,
            success: function() {
                navigation.showMain(true);
            }
        });
    };
};