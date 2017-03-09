/*exported FactionEntry */
/*globals ko */
var FactionEntry = function(faction, user, serverFactionEntry) {
    var self = this;
    self.id = ko.observable();
    self.faction = ko.observable(faction ? faction : undefined);
    self.user = ko.observable(user ? user : undefined);
    self.victoryPoints = ko.observable(serverFactionEntry ? serverFactionEntry.VictoryPointsScored : undefined);
    self.territoryBonusSpent = ko.observable(serverFactionEntry ? serverFactionEntry.TerritoryBonusSpent : undefined);
    
    self.clone = function() {
        var factionEntry = new FactionEntry();
        factionEntry.id(self.id());
        factionEntry.faction(self.faction().clone());
        factionEntry.user(self.user().clone());
        factionEntry.victoryPoints(self.victoryPoints());
        factionEntry.territoryBonusSpent(self.territoryBonusSpent());
        return factionEntry;
    };
};