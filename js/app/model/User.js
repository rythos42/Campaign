/*exported User */
/*globals ko */
var User = function(id, username, serverTerritoryBonus, serverAttacks) {
    var self = this;
        
    self.id = ko.observable(id);
    self.username = ko.observable(username);
    self.isLoggedIn = ko.observable(false);
    self.permissions = ko.observableArray();
    self.territoryBonus = ko.observable(serverTerritoryBonus);
    self.attacks = ko.observable(serverAttacks);  

    // used in the autocomplete, because it apparently can't read observables
    self.name = username;
    
    self.username.subscribe(function(newName) {
        self.name = newName;
    });

    self.hasPermission = function(permissionId) {
        return $.inArray(permissionId, self.permissions()) > -1;
    };
    
    self.clone = function() {
        var user = new User(self.id(), self.username(), serverTerritoryBonus, serverAttacks);
        user.isLoggedIn(self.isLoggedIn());
        return user;
    };
    
    self.setFromJson = function(jsonUser) {
        self.id(jsonUser.Id);
        self.username(jsonUser.Name);
        self.permissions($.map(jsonUser.Permissions, function(serverPermission) { return serverPermission.Id; }));
        self.territoryBonus(jsonUser.TerritoryBonus);
        self.attacks(jsonUser.Attacks);
    };
};