/*exported FactionEntryListItemViewModel */
/*globals ko */
var FactionEntryListItemViewModel = function(currentEntry, factionEntry, reloadEvents) {
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
    
    self.isAttackingUser = ko.computed(function() {
        var attackingUser = currentEntry.attackingUser();
        return attackingUser ? currentEntry.attackingUser().id() === factionEntry.user().id() : false;
    });
    
    self.removeFactionEntry = function() {
        var factionEntries = currentEntry.factionEntries(),
            factionEntryIndex = factionEntries.indexOf(factionEntry);
            
        if(factionEntryIndex !== -1)
            currentEntry.factionEntries.splice(factionEntryIndex, 1);
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            data: {
                action: 'DeleteFactionEntry',
                factionEntryId: factionEntry.id(),
                campaignId: currentEntry.campaignId()
            }
        }).then(function() {
            reloadEvents.reloadSummary();
        });
    };
};