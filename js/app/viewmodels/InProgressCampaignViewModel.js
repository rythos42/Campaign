/*exported InProgressCampaignViewModel */
/*globals ko, toastr, CreateEntryViewModel, EntryListViewModel, DialogResult, GiveTerritoryBonusToUserDialogViewModel, Translation, DateTimeFormatter */
var InProgressCampaignViewModel = function(user, navigation) {
    var self = this,
        currentCampaign = ko.observable(null),
        userCampaignData = ko.observable(),
        internalEntryList = ko.observableArray(),
        currentlyLoadingEntryList = false;

    self.createEntryViewModel = new CreateEntryViewModel(user, navigation, currentCampaign);
    self.entryListViewModel = new EntryListViewModel(navigation, currentCampaign, internalEntryList);
    self.giveTerritoryBonusToUserDialogViewModel = new GiveTerritoryBonusToUserDialogViewModel(user, currentCampaign);
    
    self.showInProgressCampaign = ko.computed(function() {
        return navigation.showInProgressCampaign();
    });
    
    self.isMapCampaign = ko.computed(function() {
        var campaign = currentCampaign();
        return campaign ? campaign.isMapCampaign() : false;
    });
    
    self.availableTerritoryBonus = ko.computed(function() {
        var userData = userCampaignData();
        return userData ? userData.TerritoryBonus : 0;
    });

    self.mandatoryAttacks = ko.computed(function() {
        var userData = userCampaignData();
        if(!userData)
            return '';
        
        var attacks = userData.Attacks,
            mandatoryAttacks = userData.MandatoryAttacks;
            
        return attacks > mandatoryAttacks 
            ? (mandatoryAttacks + '/' + mandatoryAttacks) 
            : (attacks + '/' + mandatoryAttacks);
    });
    
    self.optionalAttacks = ko.computed(function() {
        var userData = userCampaignData();
        if(!userData)
            return '';
                
        var attacks = userData.Attacks,
            mandatoryAttacks = userData.MandatoryAttacks,
            optionalAttacks = userData.OptionalAttacks;
            
        return (attacks > mandatoryAttacks)
            ? ((attacks - mandatoryAttacks) + '/' + optionalAttacks)
            : '0/' + optionalAttacks;
    });
    
    self.showResetPhaseButton = ko.computed(function() {
        return self.isMapCampaign() && currentCampaign().createdByUserId() === user.id();
    });
    
    self.phaseStartDate = ko.computed(function() {
        var userData = userCampaignData();
        return userData ? DateTimeFormatter.formatDate(userData.PhaseStartDate) : '';
    });
    
    self.factionEntrySummaries = ko.computed(function() {
        var factionEntrySummaries = {};
        $.each(internalEntryList(), function(i, entry) {
            $.each(entry.factionEntries(), function(j, factionEntry) {
                var factionId = factionEntry.faction().id();
                if(!factionEntrySummaries[factionId])
                    factionEntrySummaries[factionId] = new FactionEntrySummaryViewModel(factionEntry);
                
                var factionSummary = factionEntrySummaries[factionId];
                factionSummary.addVictoryPoints(factionEntry.victoryPoints());
            });
        });
        return $.map(factionEntrySummaries, function(factionEntrySummary) {
            return factionEntrySummary;
        });
    });
        
    self.requestCreateEntry = function() {
        navigation.showCreateEntry(true);
    };
    
    self.back = function() {
        currentCampaign(null);
        navigation.showMain(true);
    };
            
    self.showGiveTerritoryBonusDialog = function() {
        self.giveTerritoryBonusToUserDialogViewModel.openDialog();
    };
    
            
    function getEntryList() {
        var campaign = currentCampaign();
        
        // Don't do it again if we're already doing it.
        if(!campaign || currentlyLoadingEntryList)
            return;
        
        currentlyLoadingEntryList = true;
        var params = { action: 'GetEntryList', campaignId: campaign.id() };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'GET',
            data: params,
            dataType: 'JSON',
            success: function(serverEntryList) {
                internalEntryList($.map(serverEntryList, function(serverEntry) {
                    return new Entry(campaign.id(), serverEntry);
                }));
                currentlyLoadingEntryList = false;
            }
        });
    }
        
    var setUserDataForCampaign = function(userDataForCampaign) {
        userCampaignData(userDataForCampaign);
        currentCampaign().mandatoryAttacks(userDataForCampaign.MandatoryAttacks);
        currentCampaign().optionalAttacks(userDataForCampaign.OptionalAttacks);
    };
    
    self.resetPhase = function() {
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'POST',
            dataType: 'JSON',
            data: { 
                action: 'ResetPhase', 
                campaignId: currentCampaign().id() 
            },
            success: function(userDataForCampaign) {
                setUserDataForCampaign(userDataForCampaign);
                toastr.info(Translation.getString('nowOnNextPhase'));
            }
        });
    };

    var refreshUserDataForCampaign = function() {
        $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'POST',
            dataType: 'JSON',
            data: { 
                action: 'GetUserDataForCampaign', 
                campaignId: currentCampaign().id() 
            },
            success: setUserDataForCampaign
        });
    };
    
    navigation.showInProgressCampaign.subscribe(function(show) {
        if(!show)
            return;

        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        
        if(newCampaign)
            currentCampaign(newCampaign);
        
        refreshUserDataForCampaign();
    });
    
    self.giveTerritoryBonusToUserDialogViewModel.dialogResult.subscribe(function(result) {
        if(result === DialogResult.Saved) {
            $.ajax({
                url: 'src/webservices/UserService.php',
                data: {
                    action: 'GiveTerritoryBonusInCampaignTo',
                    userId: self.giveTerritoryBonusToUserDialogViewModel.selectedUser().id(),
                    campaignId: currentCampaign().id(),
                    amount: 1
                },
                success: function() {
                    refreshUserDataForCampaign();
                }
            });
        }
    });
    
    currentCampaign.subscribe(function() {
        // when the campaign is changed, update the entry list
        getEntryList();
    });
    
    navigation.showInProgressCampaign.subscribe(function(show) {
        if(!show) 
            internalEntryList.removeAll();
        else // when we come here after creating an entry, update the entry list
            getEntryList();
    });
};