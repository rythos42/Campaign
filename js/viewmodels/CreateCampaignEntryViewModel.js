var CreateCampaignEntryViewModel = function(navigation) {
    var self = this;

    self.showCreateCampaignEntry = ko.computed(function() {
        return navigation.showCreateCampaignEntry();
    });
           
    self.showCreateCampaignEntryButton = ko.computed(function() {
        return navigation.showMain();
    });
    
    self.saveCampaignEntry = function() {
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
    
    self.requestCreateCampaignEntry = function() {
        navigation.showCreateCampaignEntry(true);
    }
};