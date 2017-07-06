/*exported CreateEntryViewModel */
/*globals _, ko, FactionEntryListItemViewModel, Entry, DialogResult, ConfirmationDialogViewModel */
var CreateEntryViewModel = function(user, navigation, currentCampaign, userCampaignData) {
    var self = this,
        currentEntry = new Entry(user),
        attackingAnywhere = ko.observable(false);
        
    self.confirmFinishDialogViewModel = new ConfirmationDialogViewModel();
    
    self.narrative = currentEntry.narrative;
    self.territoryOnMapId = currentEntry.territoryBeingAttackedIdOnMap;
    self.currentUserWroteNarrative = ko.observable(false);
    self.victoryType = ko.observable('VPs');
    
    self.showCreateEntry = ko.computed(function() {
        return navigation.showCreateEntry();
    });
       
    self.factionEntries = ko.computed(function() {
        return $.map(currentEntry.factionEntries(), function(factionEntry) {
            return new FactionEntryListItemViewModel(currentEntry, factionEntry, null, attackingAnywhere, null, self.victoryType);
        });
    });
        
    var isFactionEntryValid = ko.computed(function() {
        return _.reduce(self.factionEntries(), function(isValid, factionEntry) {
            var hasVictoryEntry = factionEntry.victoryPoints.isValid() || factionEntry.wld.isValid();
            return isValid && hasVictoryEntry && factionEntry.territoryBonusSpent.isValid();
        }, true);
    });
    
    var showTableValidationErrors = function() {
        _.each(self.factionEntries(), function(factionEntry) { 
            if(factionEntry.isVPs())
                factionEntry.victoryPoints.isModified(true);
            else if(factionEntry.isWLD())
                factionEntry.wld.isModified(true);
            factionEntry.territoryBonusSpent.isModified(true);
        });
    };
    
    self.hasFactionEntries = ko.computed(function() {
        return self.factionEntries().length > 0;
    });
    
    self.isMapCampaign = ko.computed(function() {
        var campaignObj = currentCampaign();
        return campaignObj ? campaignObj.isMapCampaign() : false;
    });
    
    self.hasJoinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });
    
    self.isFinished = ko.computed(function() {
        return currentEntry.isFinished();
    });
    
    self.isReadOnly = ko.computed(function() {
        return self.isFinished() || !self.hasJoinedCampaign();
    });
    
    self.showAdminStuff = ko.computed(function() {
        var userData = userCampaignData();
        if(!userData)
            return false;
        
        return !self.isReadOnly() && userData.IsAdmin;
    });
    
    self.isVPs = ko.computed(function() {
        return self.victoryType() === 'VPs';
    });
    
    self.isWLD = ko.computed(function() {
        return self.victoryType() === 'WLD';
    });
    
    self.finish = function() {
        if(!isFactionEntryValid()) {
            showTableValidationErrors();
            return;
        }
        
        self.confirmFinishDialogViewModel.openDialog();
    };
    
    self.saveCampaignEntry = function() {
        saveCampaignEntry({finish: false});
    };
    
    function saveCampaignEntry(args) {
        if(!isFactionEntryValid()) {
            showTableValidationErrors();
            return;
        }
        
        var params = {
            action: 'SaveCampaignEntry',
            campaignEntry: ko.toJSON(currentEntry),
            currentUserWroteNarrative: self.currentUserWroteNarrative(),
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
           
    function clearEntry() {
        currentEntry.id(undefined);
        currentEntry.createdOnDate(undefined);
        currentEntry.createdByUsername(undefined);
        currentEntry.territoryBeingAttackedIdOnMap(undefined);
        currentEntry.finishDate(undefined);
        currentEntry.narrative(undefined);
        self.currentUserWroteNarrative(false);
    }
    
    self.confirmFinishDialogViewModel.dialogResult.subscribe(function(dialogResult) {
        if(dialogResult === DialogResult.Saved)
            saveCampaignEntry({finish: true});
    });
                  
    navigation.showCreateEntry.subscribe(function(show) {
        if(!show)
            return;
        
        clearEntry();
        var parameter = navigation.parameters();
        navigation.parameters(null);
        if(parameter) {
            navigation.parameters(null);
            currentEntry.copyFrom(parameter);
            
            var firstFactionEntry = self.factionEntries()[0],
                isWld = firstFactionEntry.wld();
            
            self.victoryType(isWld ? 'WLD' : 'VPs');
            firstFactionEntry[isWld ? 'wldHasFocus' : 'victoryPointsHasFocus'](true);
        }
        else {
            currentEntry.clear();
        }
    });
        
    currentCampaign.subscribe(function(newCampaign) {
        if(!newCampaign)
            currentEntry.campaignId(undefined);
        else
            currentEntry.campaignId(newCampaign.id());
    });
};