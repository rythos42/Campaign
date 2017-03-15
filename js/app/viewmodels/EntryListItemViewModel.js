/*exported EntryListItemViewModel */
/*globals ko, FactionEntryListItemViewModel */
var EntryListItemViewModel = function(entry, navigation) {
    var self = this;
    
    self.createdOnDate = entry.createdOnDate;
    self.createdByUsername = entry.createdByUsername;
            
    self.finished = ko.computed(function() {
        return entry.finishDate() !== undefined && entry.finishDate() !== null;
    });
    
    // The separation between firstFactionEntry and restOfFactionEntries is needed because KO can't render tables with the rowspan
    // property the way that HTML needs them to be rendered. So I create one row for the first entry, with the date/time column 
    // having a rowspan equal to the faction country, then the rest of the rows flow. 
    // see http://stackoverflow.com/a/9830847/697310 for description of rowspan
    self.firstFactionEntry = ko.computed(function() {
        if(entry.factionEntries().length === 0)
            return null;
        
        return new FactionEntryListItemViewModel(entry, entry.factionEntries()[0]);
    });   
    
    self.restOfFactionEntries = ko.computed(function() {
        var entries = $.map(entry.factionEntries(), function(factionEntry) {
            return new FactionEntryListItemViewModel(entry, factionEntry);
        });
        entries.shift();
        return entries;
    });
    
    self.factionEntryCount = ko.computed(function() {
        return entry.factionEntries().length;
    });
    
    self.openEntry = function() {
        navigation.parameters(entry);
        navigation.showCreateEntry(true);
    };
};