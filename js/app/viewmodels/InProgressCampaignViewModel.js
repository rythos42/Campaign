/*exported InProgressCampaignViewModel */
/*globals ko, toastr, CreateEntryViewModel, EntryListViewModel, DialogResult, Translation, InProgressCampaignMapViewModel, GiveTerritoryBonusToUserDialogViewModel, DateTimeFormatter, FactionEntrySummaryViewModel, Entry, PlayerListViewModel, TextFieldDialogViewModel, DropDownListDialogViewModel */
var InProgressCampaignViewModel = function(user, navigation) {
    var self = this,
        currentCampaign = ko.observable(null),
        userCampaignData = ko.observable(),
        internalEntryList = ko.observableArray(),
        currentlyLoadingEntryList = false,
        finishedLoading = ko.observable(false);

    self.createEntryViewModel = new CreateEntryViewModel(user, navigation, currentCampaign);
    self.entryListViewModel = new EntryListViewModel(navigation, currentCampaign, internalEntryList, userCampaignData);
    self.playerListViewModel = new PlayerListViewModel(currentCampaign);
    self.giveTerritoryBonusToUserDialogViewModel = new GiveTerritoryBonusToUserDialogViewModel(user, currentCampaign);
    self.addNewsDialogViewModel = new TextFieldDialogViewModel();
    self.inProgressCampaignMapViewModel = new InProgressCampaignMapViewModel(navigation, user, currentCampaign, userCampaignData);
    
    self.factions = ko.computed(function() {
        var campaign = currentCampaign();
        return campaign ? campaign.factions() : [];
    });
    
    self.joinCampaignDialogViewModel = new DropDownListDialogViewModel(self.factions, 'name', Translation.getString('selectFaction'));
    
    self.showInProgressCampaign = ko.computed(function() {
        return navigation.showInProgressCampaign() && finishedLoading();
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
    
    self.showAdminButton = ko.computed(function() {
        var campaign = currentCampaign();
        return campaign ? campaign.createdByUserId() === user.id() : false;
    });
    
    self.showResetPhaseButton = ko.computed(function() {
        return self.isMapCampaign();
    });
    
    self.phaseStartDate = ko.computed(function() {
        var userData = userCampaignData();
        if(!userData || !userData.PhaseStartDate)
            return '--';
        
        return DateTimeFormatter.formatDate(userData.PhaseStartDate);
    });
        
    self.hasJoinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });
    
    self.joinedCampaign = ko.computed(function() {
        if(!self.hasJoinedCampaign())
            return null;
        
        return currentCampaign();
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
    
    self.currentUserOutOfAttacks = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return false;
        
        return user.attacks() > (campaign.mandatoryAttacks() + campaign.optionalAttacks());
    });

    self.back = function() {
        userCampaignData(null);
        currentCampaign(null);
        user.clearCampaignData();
        
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
        
        $.when(
            $.ajax({
                url: 'src/webservices/CampaignService.php',
                method: 'GET',
                data: params,
                dataType: 'JSON'
            }), 
            self.playerListViewModel.loadedPlayersPromise
        ).then(function(ajaxResults) {
            var serverEntryList = ajaxResults[0];
            internalEntryList($.map(serverEntryList, function(serverEntry) {
                return new Entry(user, campaign, serverEntry);
            }));
            currentlyLoadingEntryList = false;
        });
    }
    
    var setUserDataForCampaign = function(userDataForCampaign) {
        userCampaignData(userDataForCampaign);
        user.territoryBonus(userDataForCampaign.TerritoryBonus);
        user.attacks(userDataForCampaign.Attacks);
        user.factionId(userDataForCampaign.FactionId);
        currentCampaign().mandatoryAttacks(userDataForCampaign.MandatoryAttacks);
        currentCampaign().optionalAttacks(userDataForCampaign.OptionalAttacks);
        finishedLoading(true);
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
    
    self.joinCampaign = function() {
        self.joinCampaignDialogViewModel.openDialog();
    };
    
    self.addNews = function() {
        self.addNewsDialogViewModel.openDialog();
    };
    
    self.joinCampaignDialogViewModel.dialogResult.subscribe(function(result) {
        if(result === DialogResult.Saved) {
            $.ajax({
                url: 'src/webservices/CampaignService.php',
                method: 'POST',
                dataType: 'JSON',
                data: { 
                    action: 'JoinCampaign', 
                    campaignId: currentCampaign().id(),
                    factionId: self.joinCampaignDialogViewModel.selectedValue().id()
                },
                success: setUserDataForCampaign
            });
        }
    });
    
    self.addNewsDialogViewModel.dialogResult.subscribe(function(result) {
        if(result === DialogResult.Saved) {
            $.ajax({
                url: 'src/webservices/NewsService.php',
                data: {
                    action: 'AddNews',
                    createdByUserId: user.id(),
                    campaignId: currentCampaign().id(),
                    text: self.addNewsDialogViewModel.text()
                }
            }).then(function() {
                toastr.info(Translation.getString('newsAdded'));
            });
        }
    });
    
    navigation.showInProgressCampaign.subscribe(function(show) {
        if(!show) {
            finishedLoading(false);
            return;
        }

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