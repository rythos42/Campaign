/*exported EntryListItemViewModel */
/*globals ko, FactionEntryListItemViewModel */
var EntryListItemViewModel = function(entry, navigation) {
    var self = this;
    
    self.createdOnDate = entry.createdOnDate;
    self.createdByUsername = entry.createdByUsername;
    
    self.factionEntries = ko.computed(function() {
        return $.map(entry.factionEntries(), function(factionEntry) {
            return new FactionEntryListItemViewModel(entry, factionEntry);
        });
    });
    
    self.openEntry = function() {
        navigation.parameters(entry);
        navigation.showCreateEntry(true);
    };
};