/*exported Entry */
/*globals ko, Faction, User, FactionEntry */
var Entry = function(campaign, serverEntry) {
    var self = this;
    
    self.id = ko.observable(serverEntry ? serverEntry.Id : undefined);
    self.createdOnDate = ko.observable(serverEntry ? serverEntry.CreatedOnDate : undefined);
    self.campaignId = ko.observable(campaign ? campaign.id() : undefined);
    self.factionEntries = ko.observableArray();
    self.attackingFaction = ko.observable();
    self.createdByUsername = ko.observable(serverEntry ? serverEntry.CreatedByUsername : undefined);
    self.territoryBeingAttacked = ko.observable();
    self.territoryBeingAttackedIdOnMap = ko.observable(serverEntry ? serverEntry.TerritoryBeingAttackedIdOnMap : undefined);
    self.finishDate = ko.observable(serverEntry ? serverEntry.FinishDate : undefined);
        
    if(serverEntry) {
        $.each(campaign.factions(), function(index, faction) {
            if(faction.id() === serverEntry.AttackingFactionId) {
                self.attackingFaction(faction);
                return false;
            }
            return true;
        });
        
        $.each(serverEntry.FactionEntries, function(index, serverFactionEntry) {
            var faction = new Faction(serverFactionEntry.FactionName, serverFactionEntry.FactionId);
            var user = new User(serverFactionEntry.UserId, serverFactionEntry.Username);
            var factionEntry = new FactionEntry(faction, user, serverFactionEntry);
            factionEntry.id(serverFactionEntry.Id);
            self.factionEntries.push(factionEntry);
        });
    }
    
    self.updateTerritoryBeingAttacked = function(adjacentTerritories) {
        $.each(adjacentTerritories, function(index, territory) {
            if(territory.IdOnMap === self.territoryBeingAttackedIdOnMap()) {
                self.territoryBeingAttacked(territory);
                return false;
            }
            return true;
        });
    };
    
    self.clear = function() {
        self.factionEntries.removeAll();
    };
    
    self.copyFrom = function(entry) {
        self.id(entry.id());
        self.createdOnDate(entry.createdOnDate());
        self.campaignId(entry.campaignId());
        self.factionEntries(entry.factionEntries());
        self.attackingFaction(entry.attackingFaction());
        self.createdByUsername(entry.createdByUsername());
        self.territoryBeingAttacked(entry.territoryBeingAttacked());
        self.territoryBeingAttackedIdOnMap(entry.territoryBeingAttackedIdOnMap());
    };
};