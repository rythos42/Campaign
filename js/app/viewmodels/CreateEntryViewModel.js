/*exported CreateEntryViewModel */
/*globals ko, FactionEntryListItemViewModel, Entry, FactionEntry, Translation, EntryMapViewModel */
var CreateEntryViewModel = function(user, navigation, currentCampaign) {
    var self = this,
        currentEntry = new Entry(),
        factionEntry = new FactionEntry();
        
    self.entryMapViewModel = new EntryMapViewModel(navigation, currentCampaign, currentEntry);
    
    self.factionSelectionHasFocus = ko.observable(false);
    self.selectedFaction = factionEntry.faction.extend({
        required: { message: Translation.getString('factionEntryRequiredValidation') }
    });
    
    self.selectedUser = factionEntry.user.extend({
        required: { message: Translation.getString('userEntryRequiredValidation') },
        requireObject: { message: Translation.getString('userEntryInvalidAccountValidation') }
    });
    
    self.victoryPoints = factionEntry.victoryPoints.extend({
        required: { message: Translation.getString('victoryPointsEntryRequiredValidation') }
    });
    
    self.territoryBonusSpent = factionEntry.territoryBonusSpent.extend({
        min: { params: 0, message: Translation.getString('atLeastZero') },
        max: { params: ko.computed(function() {
            var user = self.selectedUser();
            return (user && user.getAvailableTerritoryBonusForCampaign) ? user.getAvailableTerritoryBonusForCampaign(currentCampaign().id()) : 0;
        }), message: Translation.getString('cannotSpendMoreThan') }
    });

    self.isAttackingFaction = factionEntry.isAttackingFaction.extend({
        userMaximumAttacks: { params: {user: self.selectedUser, campaign: currentCampaign}, message: Translation.getString('userOutOfAttacks') }
    });
       
    self.needsAttackingFaction = ko.computed(function() {
        return currentEntry.attackingFaction() === null;
    });
        
    self.showCreateEntry = ko.computed(function() {
        return navigation.showCreateEntry();
    });
    
    self.factionEntries = ko.computed(function() {
        return $.map(currentEntry.factionEntries(), function(factionEntry) {
            return new FactionEntryListItemViewModel(currentEntry, factionEntry);
        });
    }).extend({
        minLength: { params: 1, message: Translation.getString('minimumOneFactionValidation') },
        mustContain: { params: { searchFor: true, objectProperty: 'isAttackingFaction' }, message: Translation.getString('attackerRequiredValidator') }
    });
    
    self.hasFactionEntries = ko.computed(function() {
        return self.factionEntries().length > 0;
    });
    
    self.availableFactions = ko.computed(function() {
        var campaignObj = currentCampaign();
        return campaignObj ? campaignObj.factions() : null;
    });
    
    self.isMapCampaign = ko.computed(function() {
        var campaignObj = currentCampaign();
        return campaignObj ? campaignObj.isMapCampaign() : false;
    });
    
    var validatedEntry = ko.validatedObservable([
        self.factionEntries,
        self.entryMapViewModel.selectedTerritory
    ]);
        
    self.saveCampaignEntry = function() {
        if(!validatedEntry.isValid()) {
            validatedEntry.errors.showAllMessages();
            return;
        }
        
        var params = {
            action: 'SaveCampaignEntry',
            campaignEntry: ko.toJSON(currentEntry),
            territoryIdOnMap: currentCampaign().isMapCampaign() ? self.entryMapViewModel.selectedTerritory().IdOnMap : null
        };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'POST',
            data: params,
            success: function() {
                navigation.showInProgressCampaign(true);
                self.entryMapViewModel.clearMap();
            }
        });
    };
    
    self.back = function() {
        navigation.showInProgressCampaign(true);
    };
    
    self.keyPressAddFaction = function(viewModel, event) {
        if(event.keyCode === 13)
            self.addFaction();  
        return true;
    };    
        
    var factionEntryValidationViewModel = ko.validatedObservable([
        self.selectedFaction,
        self.selectedUser,
        self.victoryPoints,
        self.isAttackingFaction
    ]);
    
    self.addFaction = function() {
        if(!factionEntryValidationViewModel.isValid()) {
            factionEntryValidationViewModel.errors.showAllMessages();
            return;
        }
        
        currentEntry.factionEntries.push(factionEntry.clone());
        self.clearEntry();
        
        self.factionSelectionHasFocus(true);
    };
    
    self.clearEntry = function() {
        self.selectedFaction(undefined);
        self.selectedFaction.isModified(false);
        self.selectedUser(undefined);
        self.selectedUser.isModified(false);
        self.victoryPoints(undefined);
        self.victoryPoints.isModified(false);
        self.isAttackingFaction(false);
        self.territoryBonusSpent(undefined);
        
        self.factionEntries.isModified(false);
    };
               
    navigation.showCreateEntry.subscribe(function(show) {
        self.entryMapViewModel.clearMap();
        
        if(!show)
            return;
        
        currentEntry.clear();        
        self.clearEntry();
        self.factionSelectionHasFocus(true);
    });
    
    currentCampaign.subscribe(function(newCampaign) {
        if(!newCampaign)
            currentEntry.campaignId(undefined);
        else
            currentEntry.campaignId(newCampaign.id());
    });
};