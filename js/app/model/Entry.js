/*exported Entry */
/*globals ko, User, FactionEntry */
var Entry = function(user, campaign, serverEntry) {
    var self = this;
    
    self.id = ko.observable(serverEntry ? serverEntry.Id : undefined);
    self.createdOnDate = ko.observable(serverEntry ? serverEntry.CreatedOnDate : undefined);
    self.campaignId = ko.observable(campaign ? campaign.id() : undefined);
    self.factionEntries = ko.observableArray();
    self.attackingUser = ko.observable();
    self.createdByUsername = ko.observable(serverEntry ? serverEntry.CreatedByUsername : undefined);
    self.territoryBeingAttackedIdOnMap = ko.observable(serverEntry ? serverEntry.TerritoryBeingAttackedIdOnMap : undefined);
    self.finishDate = ko.observable(serverEntry ? serverEntry.FinishDate : undefined);
    self.narrative = ko.observable(serverEntry ? serverEntry.Narrative : undefined);
        
    if(serverEntry) {
        $.each(campaign.players(), function(index, user) {
            if(user.id() === serverEntry.AttackingUserId) {
                self.attackingUser(user);
                return false;
            }
            return true;
        });
        
        $.each(serverEntry.FactionEntries, function(index, serverFactionEntry) {
            var faction = campaign.getFactionById(serverFactionEntry.FactionId),
                user = new User(serverFactionEntry);
            user.id(serverFactionEntry.UserId);
            
            var factionEntry = new FactionEntry(faction, user, serverFactionEntry);
            factionEntry.id(serverFactionEntry.Id);
            self.factionEntries.push(factionEntry);
        });
    }
    
    self.isFinished = ko.computed(function() {
        var finishDate = self.finishDate();
        return finishDate !== null && finishDate !== undefined;
    });
    
    self.hasAttackingUser = ko.computed(function() {
        return $.grep(self.factionEntries(), function(factionEntry) {
            return factionEntry.user().id() === self.attackingUser().id();
        }).length > 0;
    });    
    
    self.hasUser = function(userId) {
        return $.grep(self.factionEntries(), function(factionEntry) {
            return factionEntry.user().id() === userId;
        }).length > 0;
    };

    self.clear = function() {
        self.factionEntries.removeAll();
    };
    
    self.copyFrom = function(entry) {
        self.id(entry.id());
        self.createdOnDate(entry.createdOnDate());
        self.campaignId(entry.campaignId());
        self.attackingUser(entry.attackingUser());
        self.factionEntries(entry.factionEntries());
        self.createdByUsername(entry.createdByUsername());
        self.territoryBeingAttackedIdOnMap(entry.territoryBeingAttackedIdOnMap());
        self.finishDate(entry.finishDate());
        self.narrative(entry.narrative());
    };
};