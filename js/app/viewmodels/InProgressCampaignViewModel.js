/*exported InProgressCampaignViewModel */
/*globals ko, CreateEntryViewModel, EntryListViewModel, DialogResult, GiveTerritoryBonusToUserDialogViewModel */
var InProgressCampaignViewModel = function(user, navigation) {
    var self = this,
        currentCampaign = ko.observable(null);

    self.availableTerritoryBonus = ko.observable(0);
        
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
        
    self.requestCreateEntry = function() {
        navigation.showCreateEntry(true);
    };
    
    self.back = function() {
        navigation.showMain(true);
    };
            
    self.showGiveTerritoryBonusDialog = function() {
        self.giveTerritoryBonusToUserDialogViewModel.openDialog();
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
            success: function(userData) {
                self.availableTerritoryBonus(userData.TerritoryBonus);
            }
        });
    };
    
    navigation.showInProgressCampaign.subscribe(function(show) {
        if(!show)
            return;

        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        
        if(newCampaign)
            currentCampaign(newCampaign);
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
    
    navigation.showInProgressCampaign.subscribe(function(showInProgressCampaign) {
        if(showInProgressCampaign)
            refreshUserDataForCampaign();
    });
};