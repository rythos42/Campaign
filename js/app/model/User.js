/*exported User */
/*globals ko */
var User = function(id, username) {
    var self = this;
    
    self.id = ko.observable(id);
    self.username = ko.observable(username);
    self.isLoggedIn = ko.observable(false);
    self.permissions = ko.observableArray();
    self.territoryBonus = ko.observable();

    self.hasPermission = function(permissionId) {
        return $.inArray(permissionId, self.permissions()) > -1;
    };
    
    self.clone = function() {
        var user = new User();
        user.id(self.id());
        user.username(self.username());
        user.isLoggedIn(self.isLoggedIn());
        user.territoryBonus(self.territoryBonus());
        return user;
    };
    
    self.setFromJson = function(jsonUser) {
        self.id(jsonUser.Id);
        self.username(jsonUser.Name);
        self.permissions($.map(jsonUser.Permissions, function(serverPermission) { return serverPermission.Id; }));
        self.territoryBonus(jsonUser.TerritoryBonus);
    };
    
    self.refreshUserData = function() {
        $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'POST',
            dataType: 'JSON',
            data: { action: 'GetUserData' },
            success: function(jsonUser) {
                self.setFromJson(jsonUser);
            }
        });
    };
};