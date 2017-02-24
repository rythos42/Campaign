/*exported CreateEntryViewModel */
/*globals ko, FactionEntryListItemViewModel, Entry, FactionEntry, User, Translation, MapViewModel */
var CreateEntryViewModel = function(user, navigation, currentCampaign) {
    var self = this,
        currentEntry = new Entry(),
        factionEntry = new FactionEntry(),
        factionEntryValidationViewModel;
        
    self.mapViewModel = new MapViewModel(navigation, currentCampaign, currentEntry);
    
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
    
    self.isAttackingFaction = factionEntry.isAttackingFaction;
    
    self.needsAttackingFaction = ko.computed(function() {
        return currentEntry.attackingFaction() === null;
    });
        
    self.showCampaignEntry = ko.computed(function() {
        return navigation.showCampaignEntry();
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
    
    var validatedEntry = ko.validatedObservable([
        self.factionEntries,
        self.mapViewModel.selectedTerritory
    ]);
    
    self.saveCampaignEntry = function() {
        if(!validatedEntry.isValid()) {
            validatedEntry.errors.showAllMessages();
            return;
        }
        
        var params = {
            action: 'SaveCampaignEntry',
            campaignEntry: ko.toJSON(currentEntry),
            territoryIdOnMap: self.mapViewModel.selectedTerritory().IdOnMap
        };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'POST',
            data: params,
            success: function() {
                navigation.showMain(true);
                self.mapViewModel.clearMap();
            }
        });
    };
    
    self.back = function() {
        navigation.showMain(true);
    };
    
    self.keyPressAddFaction = function(viewModel, event) {
        if(event.keyCode === 13)
            self.addFaction();  
        return true;
    };    
    
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
        
        self.factionEntries.isModified(false);
    };
    
    self.getUsers = function(term, responseCallback) {
        $.ajax({
            url: 'src/webservices/UserService.php',
            dataType: 'JSON',
            data: {
                action: 'GetUsersByFilter',
                term: term
            },
            success: function(results) {
                responseCallback($.map(results, function(serverUser) {
                    return {
                        label: serverUser.Username,
                        object: new User(serverUser.Id, serverUser.Username)
                    };
                }));
            }
        });
    };
               
    navigation.showCampaignEntry.subscribe(function(show) {
        self.mapViewModel.clearMap();
        
        if(!show)
            return;
        
        currentEntry.clear();        
        self.clearEntry();
        self.factionSelectionHasFocus(true);
    });
    
    currentCampaign.subscribe(function(newCampaign) {
        currentEntry.campaignId(newCampaign.id());
    });
    
    factionEntryValidationViewModel = ko.validatedObservable([
        self.selectedFaction,
        self.selectedUser,
        self.victoryPoints
    ]);
};