/*exported EntryListItemViewModel */
/*globals ko, DateTimeFormatter */
var EntryListItemViewModel = function(entry, navigation, userCampaignData) {
    var self = this;
    
    self.createdOnDate = ko.computed(function() {
        return DateTimeFormatter.formatDate(entry.createdOnDate());
    });
        
    self.finishDate = ko.computed(function() {
        var finishDate = entry.finishDate();
        if(finishDate === null)
            return '';
        return DateTimeFormatter.formatDate(finishDate);
    });

    self.createdByUsername = entry.createdByUsername;
    self.territoryBeingAttackedIdOnMap = entry.territoryBeingAttackedIdOnMap;
        
    self.hasJoinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });
   
    self.openEntry = function() {
        navigation.parameters(entry);
        navigation.showCreateEntry(true);
    };
};