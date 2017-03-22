/*exported EntryListItemViewModel */
var EntryListItemViewModel = function(entry, navigation) {
    var self = this;
    
    self.createdOnDate = entry.createdOnDate;
    self.createdByUsername = entry.createdByUsername;
   
    self.openEntry = function() {
        navigation.parameters(entry);
        navigation.showCreateEntry(true);
    };
};