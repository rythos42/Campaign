/*exported EntryListViewModel */
/*globals ko, EntryListItemViewModel */
var EntryListViewModel = function(navigation, currentCampaign, entryList, userCampaignData) {
    var self = this;

    self.showCampaignEntryList = ko.computed(function() {
        return navigation.showInProgressCampaign() && self.campaignEntries().length > 0;
    });        
        
    self.campaignEntries = ko.computed(function() {
        return $.map(entryList(), function(entry) {
            return new EntryListItemViewModel(entry, navigation, userCampaignData);
        });
    });
};