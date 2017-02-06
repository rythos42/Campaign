var LoginViewModel = function(user, navigation) {
    var self = this;
    
    self.username = ko.observable('');
    self.password = ko.observable('');
    
    self.showLogin = ko.computed(function() {
        return navigation.showLogin();
    });
    
    function loginSuccess() {
        user.isLoggedIn(true);
        
        self.username('');
        self.password('');
    }    
        
    self.login = function() {
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
        var params = { 
            action: 'RegisterAndLogin',
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
};