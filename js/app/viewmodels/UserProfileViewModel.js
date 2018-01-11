/*exported UserProfileViewModel */
/*globals ko, Translation */
var UserProfileViewModel = function(user, navigation) {
    var self = this;

    self.username = user.username;
    self.email = ko.observable(user.email());
    self.password = ko.observable('').extend({
        required: { message: Translation.getString('passwordRequiredValidator') }
    });
    self.verifyPassword = ko.observable('').extend({
        areSame: { message: Translation.getString('passwordMatchValidator'), params: self.password }
    });
    self.passwordSuccessfullyChanged = ko.observable(false);
    
    var passwordValidation = ko.validatedObservable([
        self.password,
        self.verifyPassword
    ]);
    
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
        
    self.changePassword = function() {
        if(!passwordValidation.isValid()) {
            passwordValidation.errors.showAllMessages();
            return;
        }
        
        $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'POST',
            data: { 
                action: 'ChangePassword',
                password: self.password()
            }
        }).then(function() {
            self.passwordSuccessfullyChanged(true);
        });
    };
    
    navigation.showUserProfile.subscribe(function(showUserProfile) {
        if(showUserProfile) {
            self.password('');
            self.verifyPassword('');
            self.password.isModified(false);
            self.verifyPassword.isModified(false);
            self.passwordSuccessfullyChanged(false);
        }
    });
    
    self.password.subscribe(function() { self.passwordSuccessfullyChanged(false); });
    self.verifyPassword.subscribe(function() { self.passwordSuccessfullyChanged(false); });
};