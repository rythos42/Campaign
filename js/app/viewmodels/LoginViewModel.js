/*exported LoginViewModel */
/*globals ko, ExceptionCodes, Translation */
var LoginViewModel = function(user, navigation, server) {
    var self = this;
    
    self.usernameHasFocus = ko.observable(true);
    self.showUsernamePasswordIncorrect = ko.observable(false);
    self.showUsernameAlreadyTaken = ko.observable(false);
    
    self.username = ko.observable('').extend({
        required: { message: Translation.getString('usernameRequiredValidator') }
    });
    
    self.password = ko.observable('').extend({
        required: { message: Translation.getString('passwordRequiredValidator') }
    });
    
    self.showLogin = ko.computed(function() {
        return navigation.showLogin();
    });
    
    function loginSuccess() {
        user.isLoggedIn(true);
        
        self.showUsernamePasswordIncorrect(false);
        self.showUsernameAlreadyTaken(false);
        
        self.username('');
        self.password('');
    }
    
    var validatedViewModel = ko.validatedObservable([
        self.username,
        self.password
    ]);
    
    self.keyPressLogin = function(viewModel, event) {
        if(event.keyCode === 13)
            self.login();  
        return true;
    };
    
    self.login = function() {
        if(!validatedViewModel.isValid()) {
            validatedViewModel.errors.showAllMessages();
            return;
        }
        
        var params = { 
            action: 'Login',
            username: self.username(),
            password: self.password()
        };
        
        $.ajax({
            url: server.getInstallDirectory() + '/src/webservices/UserService.php',
            method: 'POST',
            data: params,
            success: loginSuccess,
            error: function() {
                self.showUsernamePasswordIncorrect(true);
            }
        });
    };
    
    self.register = function() {
        if(!validatedViewModel.isValid()) {
            validatedViewModel.errors.showAllMessages();
            return;
        }
        
        var params = { 
            action: 'RegisterAndLogin',
            username: self.username(),
            password: self.password()
        };
        
        $.ajax({
            url: server.getInstallDirectory() + '/src/webservices/UserService.php',
            method: 'POST',
            data: params,
            success: loginSuccess,
            error: function(xhr) {
                if(xhr.responseText === ExceptionCodes.UsernameExists)
                    self.showUsernameAlreadyTaken(true);
            }
        });
    };
    
    navigation.showLogin.subscribe(function(showLogin) {
        if(showLogin) {
            self.usernameHasFocus(true);
            self.username.isModified(false);
            self.password.isModified(false);
        }
    });
    
    self.username.subscribe(function() {
        self.showUsernameAlreadyTaken(false);
        self.showUsernamePasswordIncorrect(false);
    });
    
    self.password.subscribe(function() {
        self.showUsernamePasswordIncorrect(false);
    });
};