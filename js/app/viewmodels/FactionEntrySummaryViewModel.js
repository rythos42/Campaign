var FactionEntrySummaryViewModel = function(factionEntry) {
    var self = this;
    
    self.factionName = ko.computed(function() {
        var faction = factionEntry.faction();
        return faction ? faction.name() : '';
    });
    
    self.victoryPoints = ko.observable(0);
    
    self.addVictoryPoints = function(points) {
        self.victoryPoints(self.victoryPoints() + points);
    };
};