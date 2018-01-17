/*exported LoginViewModel */
/*globals ko, ExceptionCodes, Translation */
var LoginViewModel = function(user, navigation) {
    var self = this;
    
    var LoginUiType = {
        Login: 0,
        Signup: 1,
        ForgotPassword: 2,
        ForgotPasswordSuccess: 3
    };
    
    self.usernameHasFocus = ko.observable(true);
    self.showUsernamePasswordIncorrect = ko.observable(false);
    self.showUsernameAlreadyTaken = ko.observable(false);
    self.currentLoginUiType = ko.observable(LoginUiType.Login);
    self.showForgotPasswordIncorrect = ko.observable(false);
    
    self.isLogin = ko.computed(function() { return self.currentLoginUiType() === LoginUiType.Login; });
    self.isSignup = ko.computed(function() { return self.currentLoginUiType() === LoginUiType.Signup; });
    self.isForgotPassword = ko.computed(function() { return self.currentLoginUiType() === LoginUiType.ForgotPassword; });
    self.isForgotPasswordSuccess = ko.computed(function() { return self.currentLoginUiType() === LoginUiType.ForgotPasswordSuccess; });

    self.username = ko.observable('').extend({
        required: { message: Translation.getString('usernameRequiredValidator') }
    });
    
    self.password = ko.observable('').extend({
        required: { message: Translation.getString('passwordRequiredValidator'), onlyIf: function() { return self.isSignup(); } }
    });
    
    self.verifyPassword = ko.observable('').extend({
        areSame: { message: Translation.getString('passwordMatchValidator'), params: self.password }
    });
    
    self.showLogin = ko.computed(function() {
        return navigation.showLogin();
    });
        
    function clearErrorMessages() {
        self.showUsernamePasswordIncorrect(false);
        self.showUsernameAlreadyTaken(false);
        self.showForgotPasswordIncorrect(false);
    }
    
    function loginSuccess(userJson) {
        user.isLoggedIn(true);
        
        clearErrorMessages();
        
        self.username('');
        self.password('');
        self.verifyPassword('');
        self.currentLoginUiType(LoginUiType.Login);
        
        user.setFromJson(userJson);
    }
    
    var validatedViewModel = ko.validatedObservable([
        self.username,
        self.password,
        self.verifyPassword
    ]);
    
    self.login = function() {
        if(!self.isLogin())
            return;
        
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
    
    self.forgotPassword = function() {
        if(!self.username())
            return;
                        
        $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'POST',
            data: { 
                action: 'ForgotPassword',
                username: self.username() 
            },
            success: function(result) {
                if(result) {
                    clearErrorMessages();
                    self.currentLoginUiType(LoginUiType.ForgotPasswordSuccess);                
                } else {
                    self.showForgotPasswordIncorrect(true);
                }
            }
        });
    };
    
    self.requestSignup = function() {
        clearErrorMessages();
        self.currentLoginUiType(LoginUiType.Signup);
    };
    
    self.requestLogin = function() {
        clearErrorMessages();
        self.currentLoginUiType(LoginUiType.Login);
    };
    
    self.requestForgotPassword = function() {
        self.currentLoginUiType(LoginUiType.ForgotPassword);
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
        clearErrorMessages();
    });
    
    self.password.subscribe(function() {
        self.showUsernamePasswordIncorrect(false);
    });
    
    user.isLoggedIn.subscribe(function(isLoggedIn) {
        if(!isLoggedIn)
            self.usernameHasFocus(true);
    });
};