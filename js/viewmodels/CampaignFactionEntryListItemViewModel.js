var CampaignFactionEntryListItemViewModel = function(factionEntry) {
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
};