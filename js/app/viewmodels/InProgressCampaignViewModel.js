/*exported InProgressCampaignViewModel */
/*globals ko, CreateEntryViewModel, EntryListViewModel, MapViewModel */
var InProgressCampaignViewModel = function(navigation) {
    var self = this,
        currentCampaign = ko.observable(null);
    
    self.createEntryViewModel = new CreateEntryViewModel(navigation, currentCampaign);
    self.mapViewModel = new MapViewModel(navigation, currentCampaign);
    self.entryListViewModel = new EntryListViewModel(navigation, currentCampaign);
    
    navigation.showCampaignEntry.subscribe(function(show) {
        if(!show)
            return;

        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        currentCampaign(newCampaign);
    });
};