/*exported TerritoryDetailsDialogViewModel */
/*globals ko, toastr, DialogResult, Translation, FactionEntryListItemViewModel, DateTimeFormatter */
var TerritoryDetailsDialogViewModel = function(user, currentCampaign, internalEntryList, userCampaignData, reloadEvents, attackAnywhere, canCurrentUserAttack) {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    self.territory = ko.observable();

    self.isReachable = ko.observable();
    
    var territoryEntry = ko.computed(function() {
        var territory = self.territory();
        if(!territory)
            return null;
        
        return $.grep(internalEntryList(), function(entry) {
            return entry.territoryBeingAttackedIdOnMap() === territory.idOnMap() && !entry.finishDate();
        })[0];  
    });
    
    self.createdOnDate = ko.computed(function() {
        var entry = territoryEntry();
        return entry ? DateTimeFormatter.formatDate(entry.createdOnDate()) : '';
    });
    
    self.attackingPlayers = ko.computed(function() {
        var entry = territoryEntry();
        if(!entry)
            return null;
        
        var owningFactionId = self.territory() && self.territory().owningFactionId();
        return $.map(
            $.grep(entry.factionEntries(), function(factionEntry) {
                // If no owner, everyone is an attacker.
                if(!owningFactionId)
                    return true;
                
                // Otherwise, attackers are everyone it isn't owned by 
                return factionEntry.faction().id() !== owningFactionId;
            }),
            function(factionEntry) {
                return new FactionEntryListItemViewModel(entry, factionEntry, reloadEvents, attackAnywhere, self.territory);
            });
    });    
    
    self.defendingPlayers = ko.computed(function() {
        var entry = territoryEntry(),
            owningFactionId = self.territory() && self.territory().owningFactionId();
                
        // If no entry, or it is not owned, there are no defending players
        if(!entry || !owningFactionId)
            return null;
        
        // Otherwise, defenders are everyone in the faction that owns it.
        return $.map(
            $.grep(entry.factionEntries(), function(factionEntry) {
                return factionEntry.faction().id() === owningFactionId;
            }),
            function(factionEntry) {
                return new FactionEntryListItemViewModel(entry, factionEntry, reloadEvents, attackAnywhere, self.territory);
            });
    });
    
    var isBeingAttacked = ko.computed(function() {
        var territory = self.territory();
        return territory ? !!territory.attackingUsername() : false;
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
            
        // We have user data loaded, it's reachable and the user doesn't have validation issues (24 hours since attack, out of attacks)
        if(!userData || !self.isReachable() || !canCurrentUserAttack())
            return false;
        
        // Can't attack if you're already in the entry
        if(entry && entry.hasUser(user.id()))
            return false;

        // Can attack if it is unowned, or not owned by your faction.
        var owningFactionId = self.territory().owningFactionId();
        return !owningFactionId || owningFactionId !== userData.FactionId;
    });

    self.canBeDefended = ko.computed(function() {
        // Allow local admin to do whatever they want.
        if(isLocalhost())
            return true;

        var userData = userCampaignData(),
            entry = territoryEntry();
        
        // If no user data, no entry or it isn't being attacked, you can't defend.
        if(!userData || !entry || !isBeingAttacked())
            return false;
        
        // Can't defend if you're already in the entry
        if(entry.hasUser(user.id()))
            return false;
        
        // Can only defend your own territory
        var owningFactionId = self.territory().owningFactionId();
        return owningFactionId && owningFactionId === userData.FactionId;
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