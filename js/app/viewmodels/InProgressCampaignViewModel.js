/*exported InProgressCampaignViewModel */
/*globals ko, CreateEntryViewModel, EntryListViewModel */
var InProgressCampaignViewModel = function(user, navigation) {
    var self = this,
        currentCampaign = ko.observable(null);
    
    self.createEntryViewModel = new CreateEntryViewModel(user, navigation, currentCampaign);
    self.entryListViewModel = new EntryListViewModel(navigation, currentCampaign);
    
    navigation.showCampaignEntry.subscribe(function(show) {
        if(!show)
            return;

        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        currentCampaign(newCampaign);
    });
};