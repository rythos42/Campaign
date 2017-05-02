/*exported TerritoryDetailsDialogViewModel */
/*globals ko, DialogResult, Translation */
var TerritoryDetailsDialogViewModel = function(user, currentCampaign, internalEntryList, userCampaignData) {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    self.territory = ko.observable();

    self.isReachable = ko.observable();
    self.isCurrentUserAbleToAttack = ko.observable();
    
    var attackedByFactionId = ko.computed(function() {
        var territory = self.territory();
        return territory ? territory.AttackingFactionId : -1;
    });
    
    var territoryEntry = ko.computed(function() {
        var territory = self.territory();
        if(!territory)
            return null;
        
        return $.grep(internalEntryList(), function(entry) {
            return entry.territoryBeingAttackedIdOnMap() === territory.IdOnMap;
        })[0];  
    });
    
    self.attackingPlayers = ko.computed(function() {
        var theTerritoryEntry = territoryEntry();
        if(!theTerritoryEntry)
            return null;
        
        return $.map(
            $.grep(theTerritoryEntry.factionEntries(), function(factionEntry) {
                return factionEntry.faction().id() === attackedByFactionId();
            }),
            function(factionEntry) {
                return { playerName: factionEntry.user().username() };
            });
    });    
    
    self.defendingPlayers = ko.computed(function() {
        var theTerritoryEntry = territoryEntry();
        if(!theTerritoryEntry)
            return null;
        
        return $.map(
            $.grep(theTerritoryEntry.factionEntries(), function(factionEntry) {
                return factionEntry.faction().id() !== attackedByFactionId();
            }),
            function(factionEntry) {
                return { playerName: factionEntry.user().username() };
            });
    });
    
    var isBeingAttacked = ko.computed(function() {
        var territory = self.territory();
        return territory ? !!territory.AttackingUsername : false;
    });

    var attackedByUserId = ko.computed(function() {
        var territory = self.territory();
        return territory ? territory.AttackingUserId : -1;
    });

    self.canBeAttacked = ko.computed(function() {
        var userData = userCampaignData(),
            entry = territoryEntry();
            
        if(!userData || !entry || !self.isReachable() || !self.isCurrentUserAbleToAttack())
            return false;
        
        // Can't attack if you're already in the entry
        if(entry.hasUser(user.id()))
            return false;

        if(!isBeingAttacked())
            return true;
        else
            return self.territory().AttackingFactionId === userData.FactionId && user.id() !== attackedByUserId();
    });

    self.canBeDefended = ko.computed(function() {
        var userData = userCampaignData(),
            entry = territoryEntry();
            
        if(!userData || !entry || !isBeingAttacked())
            return false;
        
        // Can't defend unreachable, unless it's your own territory
        if(!self.isReachable() && self.territory().OwningFactionId !== userData.FactionId)
            return false;
        
        // Can't defend if you're already in the entry
        if(entry.hasUser(user.id()))
            return false;

        // Can't defend unclaimed territory if you have no attacks
        var territory = self.territory();
        if(!territory.OwningFactionId && !self.isCurrentUserAbleToAttack())
            return false;

        return self.territory().AttackingFactionId !== userData.FactionId;
    });
    
    self.canBePlayed = ko.computed(function() {
        return isBeingAttacked();
    });
    
    self.dialogTitle = ko.computed(function() {
        var territory = self.territory();
        return territory ? Translation.getString('territory') + ' ' + territory.IdOnMap : '';
    });
    
    self.tags = ko.computed(function() {
        var territory = self.territory();
        return territory ? territory.Tags : '';
    });
    
    self.ownedBy = ko.computed(function() {
        var campaign = currentCampaign(),
            territory = self.territory();
            
        if(!campaign || !territory)
            return '';
        
        var faction = campaign.getFactionById(territory.OwningFactionId);
        return faction ? faction.name() : Translation.getString('unowned');
    });
    
    self.defend = function() {  // defend is the same as being a second attacker, from a server perspective
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Saved);
    };
    
    self.attack = function() {    
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Saved);
    };
    
    self.played = function() {
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Navigate);
    };
    
    self.cancel = function() {
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Cancelled);
    };  
    
    self.openDialog = function() {
        self.dialogResult(DialogResult.None);
        self.dialogOpenClose(true);
    };
};