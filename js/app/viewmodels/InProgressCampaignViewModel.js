/*exported InProgressCampaignViewModel */
/*globals ko, CreateEntryViewModel, EntryListViewModel, DialogResult, GiveTerritoryBonusToUserDialogViewModel */
var InProgressCampaignViewModel = function(user, navigation) {
    var self = this,
        currentCampaign = ko.observable(null),
        userCampaignData = ko.observable();

    self.createEntryViewModel = new CreateEntryViewModel(user, navigation, currentCampaign);
    self.entryListViewModel = new EntryListViewModel(navigation, currentCampaign);
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
        
    self.requestCreateEntry = function() {
        navigation.showCreateEntry(true);
    };
    
    self.back = function() {
        navigation.showMain(true);
    };
            
    self.showGiveTerritoryBonusDialog = function() {
        self.giveTerritoryBonusToUserDialogViewModel.openDialog();
    };
    
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
};