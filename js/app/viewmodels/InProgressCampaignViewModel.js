/*exported InProgressCampaignViewModel */
/*globals ko, CreateCampaignEntryViewModel, CampaignEntryListViewModel */
var InProgressCampaignViewModel = function(navigation) {
    var self = this,
        currentCampaign = ko.observable(null);
    
    self.createCampaignEntryViewModel = new CreateCampaignEntryViewModel(navigation, currentCampaign);
    self.campaignEntryListViewModel = new CampaignEntryListViewModel(navigation, currentCampaign);
    
    self.mapImageUrl = ko.observable();
    
    self.showMap = ko.computed(function() {
        return navigation.showCampaignEntry();
    });
    
    navigation.showCampaignEntry.subscribe(function(show) {
        if(!show)
            return;

        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        currentCampaign(newCampaign);
        
        var mapImageUrl = 'src/webservices/CampaignService.php?action=GetMap&campaignId=' + newCampaign.id();
        self.mapImageUrl(mapImageUrl);
    });
};