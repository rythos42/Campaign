/*exported EntryListItemViewModel */
/*globals ko */
var EntryListItemViewModel = function(entry, navigation, userCampaignData) {
    var self = this;
    
    self.createdOnDate = entry.createdOnDate;
    self.createdByUsername = entry.createdByUsername;
        
    self.joinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });
   
    self.openEntry = function() {
        navigation.parameters(entry);
        navigation.showCreateEntry(true);
    };
};