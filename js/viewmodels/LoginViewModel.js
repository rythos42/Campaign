var LoginViewModel = function(user, navigation) {
    var self = this;
    
    self.username = ko.observable('').extend({
        required: { message: 'You\'ll want a username, trust me.' }
    });
    
    self.password = ko.observable('').extend({
        required: { message: 'You should use the easiest password possible, but you\'ll need one to keep your friends out of your account.' }
    });
    
    self.showLogin = ko.computed(function() {
        return navigation.showLogin();
    });
    
    function loginSuccess() {
        user.isLoggedIn(true);
        
        self.username('');
        self.password('');
    }
    
    var validatedViewModel = ko.validatedObservable([
        self.username,
        self.password
    ]);
        
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
            url: '/src/webservices/UserService.php',
            method: 'POST',
            data: params,
            success: loginSuccess
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
            url: '/src/webservices/UserService.php',
            method: 'POST',
            data: params,
            success: loginSuccess,
            error: function(xhr) {
                if(xhr.responseText === ExceptionCodes.UsernameExists) {
                    alert("That username is already taken, please try another!");
                }
            }
        });
    };
};