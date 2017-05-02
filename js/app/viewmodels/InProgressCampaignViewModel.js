/*exported InProgressCampaignViewModel */
/*globals _, ko, toastr, CreateEntryViewModel, EntryListViewModel, DialogResult, Translation, InProgressCampaignMapViewModel, Entry, PlayerListViewModel, TextFieldDialogViewModel, DropDownListDialogViewModel, TagListViewModel, CampaignSummaryStatsViewModel, UserManager, RenameFactionDialogViewModel */
var InProgressCampaignViewModel = function(user, navigation) {
    var self = this,
        currentCampaign = ko.observable(null),
        userCampaignData = ko.observable(),
        internalEntryList = ko.observableArray(),
        currentlyLoadingEntryList = ko.observable(false),
        currentlyLoadingUserData = ko.observable(false);

    self.createEntryViewModel = new CreateEntryViewModel(user, navigation, currentCampaign, userCampaignData);
    self.entryListViewModel = new EntryListViewModel(navigation, currentCampaign, internalEntryList, userCampaignData);
    self.playerListViewModel = new PlayerListViewModel(user, currentCampaign);
    self.addNewsDialogViewModel = new TextFieldDialogViewModel();
    self.inProgressCampaignMapViewModel = new InProgressCampaignMapViewModel(navigation, user, currentCampaign, internalEntryList, userCampaignData);
    self.tagListViewModel = new TagListViewModel(currentCampaign, userCampaignData);
    self.campaignSummaryStatsViewModel = new CampaignSummaryStatsViewModel(user, currentCampaign, internalEntryList, userCampaignData);
    self.renameFactionDialogViewModel = new RenameFactionDialogViewModel(currentCampaign);
    
    self.showLoadingImage = ko.computed(function() {
        return currentlyLoadingEntryList() || self.inProgressCampaignMapViewModel.isLoadingMap() || currentlyLoadingUserData();
    });
     
    self.factions = ko.computed(function() {
        var campaign = currentCampaign();
        return campaign ? campaign.factions() : [];
    });
    
    self.joinCampaignDialogViewModel = new DropDownListDialogViewModel(self.factions, 'name', Translation.getString('selectFaction'));
    
    self.showInProgressCampaign = ko.computed(function() {
        return navigation.showInProgressCampaign();
    });
    
    self.isMapCampaign = ko.computed(function() {
        var campaign = currentCampaign();
        return campaign ? campaign.isMapCampaign() : false;
    });
        
    self.showAdminButton = ko.computed(function() {
        var data = userCampaignData();
        return data ? data.IsAdmin : false;        
    });
    
    self.showResetPhaseButton = ko.computed(function() {
        return self.isMapCampaign();
    });
        
    self.hasJoinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });
    
    self.joinedCampaign = ko.computed(function() {
        if(!self.hasJoinedCampaign())
            return null;
        
        return currentCampaign();
    });
        
    self.back = function() {
        userCampaignData(null);
        currentCampaign(null);
        user.clearCampaignData();
        
        navigation.showMain(true);
    };
            
    function getEntryList() {
        var campaign = currentCampaign();
        
        // Don't do it again if we're already doing it.
        if(!campaign || currentlyLoadingEntryList())
            return;
        
        currentlyLoadingEntryList(true);
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
            currentlyLoadingEntryList(false);
        });
    }
    
    var setUserDataForCampaign = function(userDataForCampaign) {
        userCampaignData(userDataForCampaign);
        user.setFromCampaignData(userDataForCampaign);
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
    
    self.joinCampaign = function() {
        self.joinCampaignDialogViewModel.openDialog();
    };
    
    self.addNews = function() {
        self.addNewsDialogViewModel.openDialog();
    };
    
    self.renameFaction = function() {
        self.renameFactionDialogViewModel.openDialog();
    };
    
    self.renameFactionDialogViewModel.dialogResult.subscribe(function(result) {
        if(result === DialogResult.Saved) {
            var factionId = self.renameFactionDialogViewModel.selectedFaction().id(),
                newFactionName = self.renameFactionDialogViewModel.newFactionName();
            
            $.ajax({
                url: 'src/webservices/CampaignService.php',
                data: { 
                    action: 'RenameFaction', 
                    factionId: factionId,
                    newFactionName: newFactionName
                }
            }).then(function() {
                var faction = currentCampaign().getFactionById(factionId);
                faction.name(newFactionName);
                
                _.each(internalEntryList, function(entry) {
                    if(entry.faction().id() === factionId) {
                        entry.faction().name(newFactionName);
                        return false;
                    }
                    return true;
                });
            });
        }
    });
    
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
    
    navigation.showInProgressCampaign.subscribe(function(showInProgressCampaign) {
        if(!showInProgressCampaign)
            return;
        
        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        
        if(newCampaign)
            currentCampaign(newCampaign);
        
        currentlyLoadingUserData(true);
        UserManager.refreshUserDataForCampaign(currentCampaign().id()).then(function(userDataForCampaign) {
            currentlyLoadingUserData(false);
            setUserDataForCampaign(userDataForCampaign);
        });
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
    
    self.inProgressCampaignMapViewModel.reloadEntryList.subscribe(function(reload) {
        if(!reload)
            return;
        
        getEntryList();
        self.inProgressCampaignMapViewModel.reloadEntryList(false);
    });
};