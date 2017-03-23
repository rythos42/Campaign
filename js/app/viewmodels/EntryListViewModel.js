/*exported EntryListViewModel */
/*globals ko, EntryListItemViewModel */
var EntryListViewModel = function(navigation, currentCampaign, entryList, userCampaignData) {
    var self = this;
        
    self.onlyEntriesWithoutOpponent = ko.observable(false);
        
    self.entries = ko.computed(function() {
        function makeList(list) {
            return $.map(list, function(entry) {
                return new EntryListItemViewModel(entry, navigation, currentCampaign, userCampaignData);
            });
        }
        
        if(self.onlyEntriesWithoutOpponent())
            return makeList($.grep(entryList(), function(entry) { return entry.factionEntries().length < 2; }));
        
        return makeList(entryList());
    });
};