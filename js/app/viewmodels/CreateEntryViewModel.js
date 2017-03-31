/*exported CreateEntryViewModel */
/*globals ko, FactionEntryListItemViewModel, Entry, FactionEntry, Translation, DialogResult, ConfirmationDialogViewModel, UserManager */
var CreateEntryViewModel = function(user, navigation, currentCampaign, userCampaignData) {
    var self = this,
        currentEntry = new Entry(),
        factionEntry = new FactionEntry();
        
    self.confirmFinishDialogViewModel = new ConfirmationDialogViewModel();
    
    self.factionSelectionHasFocus = ko.observable(false);
    self.isNotAttacker = ko.observable(true);
    self.narrative = currentEntry.narrative;
    
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
            return typeof(user) === 'object' ? user.territoryBonus() : 0;
        }), message: Translation.getString('cannotSpendMoreThan') }
    });
        
    self.showCreateEntry = ko.computed(function() {
        return navigation.showCreateEntry();
    });
    
    self.factionEntries = ko.computed(function() {
        return $.map(currentEntry.factionEntries(), function(factionEntry) {
            return new FactionEntryListItemViewModel(currentEntry, factionEntry);
        });
    }).extend({
        minLength: { params: 1, message: Translation.getString('minimumOneFactionValidation') }
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
    
    self.isReadOnly = ko.computed(function() {
        return currentEntry.isFinished();
    });
    
    self.showFinishButton = ko.computed(function() {
        return !self.isReadOnly();
    });
    
    self.finish = function() {
        if(!self.factionEntries.isValid()) {
            self.factionEntries.isModified(true);
            return;
        }
        
        self.confirmFinishDialogViewModel.openDialog();
    };
    
    self.saveCampaignEntry = function() {
        saveCampaignEntry({finish: false});
    };
    
    function saveCampaignEntry(args) {
        var params = {
            action: 'SaveCampaignEntry',
            campaignEntry: ko.toJSON(currentEntry),
            finish: args && args.finish
        };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'POST',
            data: params
        }).then(function() {
            navigation.showInProgressCampaign(true);
        });
    }
    
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
        self.victoryPoints
    ]);
    
    self.addFaction = function() {
        if(!factionEntryValidationViewModel.isValid()) {
            factionEntryValidationViewModel.errors.showAllMessages();
            return;
        }
        
        currentEntry.factionEntries.push(factionEntry.clone());
        clearFactionEntry();
        
        self.factionSelectionHasFocus(true);
    };
    
    self.getUsers = function(term, responseCallback) {
        var campaign = currentCampaign(),
            campaignId = campaign ? campaign.id() : 0;
            
        UserManager.getFilteredUsersForCampaign(term, campaignId, responseCallback);
    };
    
    function clearFactionEntry() {
        self.selectedFaction(undefined);
        self.selectedFaction.isModified(false);
        self.selectedUser(undefined);
        self.selectedUser.isModified(false);
        self.victoryPoints(undefined);
        self.victoryPoints.isModified(false);
        self.territoryBonusSpent(undefined);
        self.isNotAttacker(true);
        
        self.factionEntries.isModified(false);
    }
    
    function clearEntry() {
        currentEntry.id(undefined);
        currentEntry.createdOnDate(undefined);
        currentEntry.createdByUsername(undefined);
        currentEntry.territoryBeingAttackedIdOnMap(undefined);
        currentEntry.finishDate(undefined);
        currentEntry.narrative(undefined);
    }

    self.confirmFinishDialogViewModel.dialogResult.subscribe(function(dialogResult) {
        if(dialogResult === DialogResult.Saved)
            saveCampaignEntry({finish: true});
    });
               
    navigation.showCreateEntry.subscribe(function(show) {
        if(!show)
            return;
        
        clearFactionEntry();
        clearEntry();
        var parameter = navigation.parameters();
        navigation.parameters(null);
        if(parameter) {
            if(parameter instanceof Entry) {
                navigation.parameters(null);
                currentEntry.copyFrom(parameter);
            } else {
                currentEntry.clear();        
                currentEntry.territoryBeingAttacked(parameter);
                currentEntry.territoryBeingAttackedIdOnMap(parameter.IdOnMap);
                self.selectedFaction(currentCampaign().getFactionById(userCampaignData().FactionId));
                self.selectedUser(user);
                self.isNotAttacker(false);
            }
        }
        else {
            currentEntry.clear();
        }
        
        self.factionEntries.isModified(false);
        self.factionSelectionHasFocus(!self.isMapCampaign());
    });
        
    currentCampaign.subscribe(function(newCampaign) {
        if(!newCampaign)
            currentEntry.campaignId(undefined);
        else
            currentEntry.campaignId(newCampaign.id());
    });
};