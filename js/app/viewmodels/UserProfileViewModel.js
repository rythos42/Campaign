/*exported UserProfileViewModel */
/*globals ko */
var UserProfileViewModel = function(user, navigation) {
    var self = this;

    self.username = user.username;
    self.email = ko.observable(user.email());    
    
    self.showUserProfile = ko.computed(function() {
        return navigation.showUserProfile();
    });
    
    self.showUserProfileButton = ko.computed(function() {
        return user.isLoggedIn() && !navigation.showUserProfile();
    });
    
    self.noEmail = ko.computed(function() {
        return !user.email();
    });
    
    self.showProfileWarning = ko.computed(function() {
        return !user.email();
    });
    
    self.requestUserProfile = function() {
        navigation.showUserProfile(true);
    };
    
    self.back = function() {
        navigation.showMain(true);
        self.email(user.email());
    };
    
    self.save = function() {
        user.email(self.email());
        
        $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'POST',
            data: { 
                action: 'SaveUserProfile',
                user: ko.toJSON(user)
            }
        }).then(function() {
            navigation.showMain(true);
        });
    };
};