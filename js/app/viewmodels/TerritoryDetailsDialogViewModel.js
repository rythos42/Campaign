/*exported TerritoryDetailsDialogViewModel */
/*globals ko, toastr, DialogResult, Translation, FactionEntryListItemViewModel, DateTimeFormatter */
var TerritoryDetailsDialogViewModel = function(user, currentCampaign, internalEntryList, userCampaignData, reloadEvents, attackAnywhere, canCurrentUserAttack) {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    self.territory = ko.observable();

    self.isReachable = ko.observable();
    
    var attackedByFactionId = ko.computed(function() {
        var territory = self.territory();
        return territory ? territory.attackingFactionId() : -1;
    });
    
    var territoryEntry = ko.computed(function() {
        var territory = self.territory();
        if(!territory)
            return null;
        
        return $.grep(internalEntryList(), function(entry) {
            return entry.territoryBeingAttackedIdOnMap() === territory.idOnMap();
        })[0];  
    });
    
    self.createdOnDate = ko.computed(function() {
        var entry = territoryEntry();
        return entry ? DateTimeFormatter.formatDate(entry.createdOnDate()) : '';
    });
    
    self.attackingPlayers = ko.computed(function() {
        var theTerritoryEntry = territoryEntry();
        if(!theTerritoryEntry || theTerritoryEntry.finishDate())
            return null;
        
        return $.map(
            $.grep(theTerritoryEntry.factionEntries(), function(factionEntry) {
                return factionEntry.faction().id() === attackedByFactionId();
            }),
            function(factionEntry) {
                return new FactionEntryListItemViewModel(theTerritoryEntry, factionEntry, reloadEvents, attackAnywhere, self.territory);
            });
    });    
    
    self.defendingPlayers = ko.computed(function() {
        var theTerritoryEntry = territoryEntry();
        if(!theTerritoryEntry || theTerritoryEntry.finishDate())
            return null;
        
        return $.map(
            $.grep(theTerritoryEntry.factionEntries(), function(factionEntry) {
                return factionEntry.faction().id() !== attackedByFactionId();
            }),
            function(factionEntry) {
                return new FactionEntryListItemViewModel(theTerritoryEntry, factionEntry, reloadEvents, attackAnywhere, self.territory);
            });
    });
    
    var isBeingAttacked = ko.computed(function() {
        var territory = self.territory();
        return territory ? !!territory.attackingUsername() : false;
    });

    var attackedByUserId = ko.computed(function() {
        var territory = self.territory();
        return territory ? territory.attackingUserId() : -1;
    });
    
    var isLocalhost = function() {
        return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    };

    self.canBeAttacked = ko.computed(function() {
        // Allow local admin to do whatever they want.
        if(isLocalhost())
            return true;
        
        var userData = userCampaignData(),
            entry = territoryEntry();
            
        if(!userData || !self.isReachable() || !canCurrentUserAttack())
            return false;
        
        // Can't attack if you're already in the entry
        if(entry && entry.hasUser(user.id()))
            return false;

        if(!isBeingAttacked())
            return true;
        else
            return self.territory().attackingFactionId() === userData.FactionId && user.id() !== attackedByUserId();
    });

    self.canBeDefended = ko.computed(function() {
        // Allow local admin to do whatever they want.
        if(isLocalhost())
            return true;

        var userData = userCampaignData(),
            entry = territoryEntry();
            
        if(!userData || !entry || !isBeingAttacked())
            return false;
        
        // Can't defend unreachable, unless it's your own territory
        if(!self.isReachable() && self.territory().owningFactionId() !== userData.FactionId)
            return false;
        
        // Can't defend if you're already in the entry
        if(entry.hasUser(user.id()))
            return false;

        // Can't defend unclaimed territory if you have no attacks
        var territory = self.territory();
        if(!territory.owningFactionId() && !canCurrentUserAttack())
            return false;

        return self.territory().attackingFactionId() !== userData.FactionId;
    });
    
    self.canBePlayed = ko.computed(function() {
        return isBeingAttacked();
    });
    
    self.dialogTitle = ko.computed(function() {
        var territory = self.territory();
        return territory ? Translation.getString('territory') + ' ' + territory.idOnMap() : '';
    });
    
    self.tags = ko.computed(function() {
        var territory = self.territory();
        return territory ? territory.tags() : '';
    });
    
    self.ownedBy = ko.computed(function() {
        var campaign = currentCampaign(),
            territory = self.territory();
            
        if(!campaign || !territory)
            return '';
        
        var faction = campaign.getFactionById(territory.owningFactionId());
        return faction ? faction.name() : Translation.getString('unowned');
    });
    
    self.defend = function() {  // defend is the same as being a second attacker, from a server perspective
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Saved);
        toastr.info(Translation.getString('youDefended').replace('{0}', self.territory().idOnMap()));
    };
    
    self.attack = function() {    
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Saved);
        toastr.info(Translation.getString('youAttacked').replace('{0}', self.territory().idOnMap()));
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