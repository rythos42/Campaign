/*exported CampaignFactionEntryListItemViewModel */
/*globals ko */
var CampaignFactionEntryListItemViewModel = function(currentCampaignEntry, factionEntry) {
    var self = this;
    
    self.factionName = ko.computed(function() {
        var faction = factionEntry.faction();
        return faction ? faction.name() : '';
    });
    
    self.username = ko.computed(function() {
        var user = factionEntry.user();
        return user ? user.username() : '';
    });
    
    self.victoryPoints = factionEntry.victoryPoints;
    
    self.removeFactionEntry = function() {
        var factionEntries = currentCampaignEntry.factionEntries(),
            factionEntryIndex = factionEntries.indexOf(factionEntry);
            
        if(factionEntryIndex != -1)
            currentCampaignEntry.factionEntries.splice(factionEntryIndex, 1);
    };
};