/*exported CampaignEntryListItemViewModel */
var CampaignEntryListItemViewModel = function(campaignEntry) {
    var self = this;
    
    self.createdOnDate = campaignEntry.createdOnDate;
    
    self.factionEntries = ko.computed(function() {
        return $.map(campaignEntry.factionEntries(), function(campaignFactionEntry) {
            return new CampaignFactionEntryListItemViewModel(campaignFactionEntry);
        });
    });
};