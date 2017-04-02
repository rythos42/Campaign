/*exported CreateEntryViewModel */
/*globals ko, FactionEntryListItemViewModel, Entry, FactionEntry, Translation, DialogResult, ConfirmationDialogViewModel, UserManager */
var CreateEntryViewModel = function(user, navigation, currentCampaign) {
    var self = this,
        currentEntry = new Entry(user),
        factionEntry = new FactionEntry();
        
    self.confirmFinishDialogViewModel = new ConfirmationDialogViewModel();
    
    self.usernameHasFocus = ko.observable(false);
    self.victoryPointsHasFocus = ko.observable(false);
    self.hasAttackingUser = currentEntry.hasAttackingUser;
    self.narrative = currentEntry.narrative;
    self.territoryBeingAttackedIdOnMap = currentEntry.territoryBeingAttackedIdOnMap;
    
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
    
    self.keyPressAddUser = function(viewModel, event) {
        if(event.keyCode === 13)
            self.addUser();  
        return true;
    };    
        
    var factionEntryValidationViewModel = ko.validatedObservable([
        self.selectedUser,
        self.victoryPoints
    ]);
    
    self.addUser = function() {
        if(!factionEntryValidationViewModel.isValid()) {
            factionEntryValidationViewModel.errors.showAllMessages();
            return;
        }
        
        var usersFaction = currentCampaign().getFactionById(factionEntry.user().factionId());
        factionEntry.faction(usersFaction);
        
        currentEntry.factionEntries.push(factionEntry.clone());
        clearFactionEntry();
        
        self.usernameHasFocus(true);
    };
    
    self.getUsers = function(term, responseCallback) {
        var campaign = currentCampaign(),
            campaignId = campaign ? campaign.id() : 0;
            
        UserManager.getFilteredUsersForCampaign(term, campaignId, responseCallback);
    };
    
    function clearFactionEntry() {
        self.selectedUser(undefined);
        self.selectedUser.isModified(false);
        self.victoryPoints(undefined);
        self.victoryPoints.isModified(false);
        self.territoryBonusSpent(undefined);
        
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
                
                if(!self.hasAttackingUser())
                    self.selectedUser(currentEntry.attackingUser());
            } else {
                currentEntry.clear();        
                currentEntry.territoryBeingAttackedIdOnMap(parameter.IdOnMap);
                currentEntry.attackingUser(user);
                self.selectedUser(user);
            }
        }
        else {
            currentEntry.clear();
        }
        
        self.factionEntries.isModified(false);
        self.victoryPointsHasFocus(true);
    });
    
    currentEntry.hasAttackingUser.subscribe(function(hasAttackingUser) {
        if(!hasAttackingUser)
            self.selectedUser(currentEntry.attackingUser());
    });
        
    currentCampaign.subscribe(function(newCampaign) {
        if(!newCampaign)
            currentEntry.campaignId(undefined);
        else
            currentEntry.campaignId(newCampaign.id());
    });
};