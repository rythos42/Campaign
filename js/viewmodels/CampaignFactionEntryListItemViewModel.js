var CampaignFactionEntryListItemViewModel = function(factionEntry) {
    var self = this;
    
    self.factionName = ko.computed(function() {
        return factionEntry.faction().name();
    });
    
    self.user = factionEntry.user;
    self.victoryPoints = factionEntry.victoryPoints;
};