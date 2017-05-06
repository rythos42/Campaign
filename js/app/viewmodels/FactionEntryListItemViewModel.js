/*exported FactionEntryListItemViewModel */
/*globals ko, Translation */
var FactionEntryListItemViewModel = function(currentEntry, factionEntry, reloadEvents, attackingAnywhere, territory) {
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
    
    self.victoryPoints = factionEntry.victoryPoints.extend({
        required: { message: Translation.getString('victoryPointsEntryRequiredValidation') }
    });
    
    self.territoryBonusSpent = factionEntry.territoryBonusSpent.extend({
        min: { 
            params: ko.computed(function() { return attackingAnywhere() ? 1 : 0; }), 
            message: function() { return attackingAnywhere() ? Translation.getString('attackingNonAdjacentMustSpendOne') : Translation.getString('atLeastZero'); }
        },
        max: { 
            params: ko.computed(function() {
                var user = factionEntry.user();
                return typeof(user) === 'object' ? user.territoryBonus() : 0;
            }), 
            message: Translation.getString('cannotSpendMoreThan') 
        }
    });
    
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
            
            if(currentEntry.factionEntries().length === 0) {
                reloadEvents.reloadMap();
                territory().attackingUsername(undefined);
                territory().attackingUserId(undefined);
                territory().attackingFactionId(undefined);
            }
        });
    };
};