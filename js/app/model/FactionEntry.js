/*exported FactionEntry */
/*globals ko */
var FactionEntry = function(faction, user, victoryPoints) {
    var self = this;
    
    self.faction = ko.observable(faction ? faction : undefined);
    self.user = ko.observable(user ? user : undefined);
    self.victoryPoints = ko.observable((victoryPoints || victoryPoints === 0)? victoryPoints : undefined);
    self.territoryBonusSpent = ko.observable();
    
    self.clone = function() {
        var factionEntry = new FactionEntry();
        factionEntry.faction(self.faction().clone());
        factionEntry.user(self.user().clone());
        factionEntry.victoryPoints(self.victoryPoints());
        factionEntry.territoryBonusSpent(self.territoryBonusSpent());
        return factionEntry;
    };
};