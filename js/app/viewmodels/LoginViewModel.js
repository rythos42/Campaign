/*exported LoginViewModel */
/*globals ko, ExceptionCodes, Translation */
var LoginViewModel = function(user, navigation) {
    var self = this;
    
    self.usernameHasFocus = ko.observable(true);
    self.showUsernamePasswordIncorrect = ko.observable(false);
    self.showUsernameAlreadyTaken = ko.observable(false);
    self.isSignup = ko.observable(false);
    
    self.username = ko.observable('').extend({
        required: { message: Translation.getString('usernameRequiredValidator') }
    });
    
    self.password = ko.observable('').extend({
        required: { message: Translation.getString('passwordRequiredValidator') }
    });
    
    self.verifyPassword = ko.observable('').extend({
        areSame: { message: Translation.getString('passwordMatchValidator'), params: self.password }
    });
    
    self.showLogin = ko.computed(function() {
        return navigation.showLogin();
    });
    
    function loginSuccess(userJson) {
        user.isLoggedIn(true);
        
        self.showUsernamePasswordIncorrect(false);
        self.showUsernameAlreadyTaken(false);
        
        self.username('');
        self.password('');
        self.verifyPassword('');
        self.isSignup(false);
        
        user.setFromJson(userJson);
    }
    
    var validatedViewModel = ko.validatedObservable([
        self.username,
        self.password,
        self.verifyPassword
    ]);
    
    self.keyPressLogin = function(viewModel, event) {
        if(event.keyCode === 13)
            self.login();  
        return true;
    };  
    
    self.keyPressRegister = function(viewModel, event) {
        if(event.keyCode === 13)
            self.register();  
        return true;
    };
    
    self.login = function() {
        var params = { 
            action: 'Login',
            username: self.username(),
            password: self.password()
        };
        
        $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'POST',
            data: params,
            success: loginSuccess,
            error: function() {
                self.showUsernamePasswordIncorrect(true);
                self.showUsernameAlreadyTaken(false);
                self.usernameHasFocus(true);
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
            url: 'src/webservices/UserService.php',
            method: 'POST',
            data: params,
            success: loginSuccess,
            error: function(xhr) {
                if(xhr.responseText === ExceptionCodes.UsernameExists) {
                    self.showUsernamePasswordIncorrect(false);
                    self.showUsernameAlreadyTaken(true);
                    self.usernameHasFocus(true);
                }
            }
        });
    };
    
    self.requestSignup = function() {
        self.isSignup(true);
    };
    
    self.requestLogin = function() {
        self.isSignup(false);
    };
    
    navigation.showLogin.subscribe(function(showLogin) {
        if(showLogin) {
            self.usernameHasFocus(true);
            self.username.isModified(false);
            self.password.isModified(false);
            self.verifyPassword.isModified(false);
        }
    });
    
    self.username.subscribe(function() {
        self.showUsernameAlreadyTaken(false);
        self.showUsernamePasswordIncorrect(false);
    });
    
    self.password.subscribe(function() {
        self.showUsernamePasswordIncorrect(false);
    });
    
    user.isLoggedIn.subscribe(function(isLoggedIn) {
        if(!isLoggedIn)
            self.usernameHasFocus(true);
    });
};