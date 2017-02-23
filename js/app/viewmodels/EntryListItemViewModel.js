/*exported EntryListItemViewModel */
/*globals ko, FactionEntryListItemViewModel */
var EntryListItemViewModel = function(campaignEntry) {
    var self = this;
    
    self.createdOnDate = campaignEntry.createdOnDate;
    
    self.factionEntries = ko.computed(function() {
        return $.map(campaignEntry.factionEntries(), function(campaignFactionEntry) {
            return new FactionEntryListItemViewModel(campaignEntry, campaignFactionEntry);
        });
    });
};