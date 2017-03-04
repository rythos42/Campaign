/*exported UserProfileViewModel */
/*globals ko */
var UserProfileViewModel = function(user, navigation) {
    var self = this;
    
    self.showUserProfile = ko.computed(function() {
        return navigation.showUserProfile();
    });
    
    self.showUserProfileButton = ko.computed(function() {
        return user.isLoggedIn() && !navigation.showUserProfile();
    });
    
    self.username = ko.computed(function() {
        return user.username();
    });
    
    self.requestUserProfile = function() {
        navigation.showUserProfile(true);
    };
    
    self.back = function() {
        navigation.showMain(true);
    };
};