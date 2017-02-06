var LoginViewModel = function(user) {
    var self = this;
    
    self.username = ko.observable('');
    self.password = ko.observable('');
    
    self.isLoggedIn = ko.computed(function() {
        return user.isLoggedIn();
    });
        
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
            success: function() {
                user.isLoggedIn(true);
            }
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
            success: function() {
                user.isLoggedIn(true);
            }
        });
    };
};