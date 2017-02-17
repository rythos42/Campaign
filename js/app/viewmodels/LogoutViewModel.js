/*exported LogoutViewModel */
/*globals ko */
var LogoutViewModel = function(user, server) {
    var self = this;
    
    self.showLogout = ko.computed(function() {
        return user.isLoggedIn();
    });
    
    self.logout = function() {
        var params = { action: 'Logout' };
        
        $.ajax({
            url: server.getInstallDirectory() + '/src/webservices/UserService.php',
            method: 'POST',
            data: params,
            success: function() {
                user.isLoggedIn(false);
            }
        });
    };
};