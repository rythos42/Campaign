/*exported UserProfileViewModel */
/*globals ko, DialogResult, GiveTerritoryBonusToUserDialogViewModel */
var UserProfileViewModel = function(user, navigation) {
    var self = this;
    
    self.giveTerritoryBonusToUserDialogViewModel = new GiveTerritoryBonusToUserDialogViewModel();
    
    self.showUserProfile = ko.computed(function() {
        return navigation.showUserProfile();
    });
    
    self.showUserProfileButton = ko.computed(function() {
        return user.isLoggedIn() && !navigation.showUserProfile();
    });
    
    self.username = ko.computed(function() {
        return user.username();
    });
    
    self.territoryBonus = ko.computed(function() {
        return user.territoryBonus();
    });
    
    self.requestUserProfile = function() {
        navigation.showUserProfile(true);
    };
    
    self.back = function() {
        navigation.showMain(true);
    };
    
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