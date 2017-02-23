/*exported InProgressCampaignViewModel */
/*globals ko, CreateCampaignEntryViewModel, CampaignEntryListViewModel */
var InProgressCampaignViewModel = function(navigation) {
    var self = this,
        currentCampaign = ko.observable(null);
    
    self.createCampaignEntryViewModel = new CreateCampaignEntryViewModel(navigation, currentCampaign);
    self.mapViewModel = new MapViewModel(navigation, currentCampaign);
    self.campaignEntryListViewModel = new CampaignEntryListViewModel(navigation, currentCampaign);
    
    navigation.showCampaignEntry.subscribe(function(show) {
        if(!show)
            return;

        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        currentCampaign(newCampaign);
    });
};