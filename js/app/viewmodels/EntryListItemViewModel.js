/*exported EntryListItemViewModel */
/*globals ko, FactionEntryListItemViewModel */
var EntryListItemViewModel = function(entry, navigation) {
    var self = this;
    
    self.createdOnDate = entry.createdOnDate;
    self.createdByUsername = entry.createdByUsername;
            
    self.finished = ko.computed(function() {
        return entry.finishDate() !== undefined && entry.finishDate() !== null;
    });
    
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