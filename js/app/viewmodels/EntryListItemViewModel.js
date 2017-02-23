/*exported EntryListItemViewModel */
/*globals ko, FactionEntryListItemViewModel */
var EntryListItemViewModel = function(entry) {
    var self = this;
    
    self.createdOnDate = entry.createdOnDate;
    
    self.factionEntries = ko.computed(function() {
        return $.map(entry.factionEntries(), function(factionEntry) {
            return new FactionEntryListItemViewModel(entry, factionEntry);
        });
    });
};