/*exported FactionEntryListItemViewModel */
/*globals ko */
var FactionEntryListItemViewModel = function(currentCampaignEntry, factionEntry) {
    var self = this;
    
    self.factionName = ko.computed(function() {
        var faction = factionEntry.faction();
        return faction ? faction.name() : '';
    });
    
    self.username = ko.computed(function() {
        var user = factionEntry.user();
        return user ? user.username() : '';
    });
    
    self.user = ko.computed(function() {
        return factionEntry.user();
    });
    
    self.victoryPoints = factionEntry.victoryPoints;
    self.territoryBonusSpent = factionEntry.territoryBonusSpent;
    
    self.isAttackingFaction = ko.computed(function() {
        var attackingFaction = currentCampaignEntry.attackingFaction();
        return attackingFaction ? currentCampaignEntry.attackingFaction().id() === factionEntry.faction().id() : false;
    });
    
    self.removeFactionEntry = function() {
        var factionEntries = currentCampaignEntry.factionEntries(),
            factionEntryIndex = factionEntries.indexOf(factionEntry);
            
        if(factionEntryIndex !== -1)
            currentCampaignEntry.factionEntries.splice(factionEntryIndex, 1);
    };
};