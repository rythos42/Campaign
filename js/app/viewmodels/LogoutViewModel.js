/*exported LogoutViewModel */
/*globals ko */
var LogoutViewModel = function(user) {
    var self = this;
    
    self.showLogout = ko.computed(function() {
        return user.isLoggedIn();
    });
    
    self.logout = function() {
        var params = { action: 'Logout' };
        
        $.ajax({
            url: '/src/webservices/UserService.php',
            method: 'POST',
            data: params,
            success: function() {
                user.isLoggedIn(false);
            }
        });
    };
};