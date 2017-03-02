/*exported UserProfileViewModel */
/*globals ko, DialogResult, SelectUserDialogViewModel */
var UserProfileViewModel = function(user, navigation) {
    var self = this;
    
    self.selectUserDialogViewModel = new SelectUserDialogViewModel();
    
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
        self.selectUserDialogViewModel.openDialog();
    };
    
    self.selectUserDialogViewModel.dialogResult.subscribe(function(result) {
        if(result === DialogResult.Saved) {
            $.ajax({
                url: 'src/webservices/UserService.php',
                data: {
                    action: 'GiveTerritoryBonusTo',
                    userId: self.selectUserDialogViewModel.selectedUser().id(),
                    amount: 1
                }
            });
        }
    });    
};