/*exported InProgressCampaignViewModel */
/*globals ko, CreateEntryViewModel, EntryListViewModel, DialogResult, GiveTerritoryBonusToUserDialogViewModel */
var InProgressCampaignViewModel = function(user, navigation) {
    var self = this,
        currentCampaign = ko.observable(null);
    
    self.createEntryViewModel = new CreateEntryViewModel(user, navigation, currentCampaign);
    self.entryListViewModel = new EntryListViewModel(navigation, currentCampaign);
    self.giveTerritoryBonusToUserDialogViewModel = new GiveTerritoryBonusToUserDialogViewModel();
    
    self.showInProgressCampaign = ko.computed(function() {
        return navigation.showInProgressCampaign();
    });

    self.territoryBonus = ko.computed(function() {
       return 0;// return user.territoryBonus();
    });
        
    self.requestCreateEntry = function() {
        navigation.showCreateEntry(true);
    };
    
    self.back = function() {
        navigation.showMain(true);
    };
    
    navigation.showInProgressCampaign.subscribe(function(show) {
        if(!show)
            return;

        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        
        if(newCampaign)
            currentCampaign(newCampaign);
    });
        
    self.showGiveTerritoryBonusDialog = function() {
        self.giveTerritoryBonusToUserDialogViewModel.openDialog();
    };
    
    self.giveTerritoryBonusToUserDialogViewModel.dialogResult.subscribe(function(result) {
        if(result === DialogResult.Saved) {
            $.ajax({
                url: 'src/webservices/UserService.php',
                data: {
                    action: 'GiveTerritoryBonusTo',
                    userId: self.giveTerritoryBonusToUserDialogViewModel.selectedUser().id(),
                    amount: 1
                },
                success: function() {
                    user.refreshUserData();
                }
            });
        }
    });
    
    navigation.showUserProfile.subscribe(function(showUserProfile) {
        if(showUserProfile)
            user.refreshUserData();
    });
};