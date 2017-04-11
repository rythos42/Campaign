/*exported User */
/*globals ko */
var User = function(serverUser) {
    var self = this;

    self.id = ko.observable(serverUser ? serverUser.Id : undefined);
    self.username = ko.observable(serverUser ? serverUser.Username : undefined);
    self.email = ko.observable(serverUser ? serverUser.Email : undefined);
    self.isLoggedIn = ko.observable(false);
    self.permissions = ko.observableArray();
    self.territoryBonus = ko.observable(serverUser ? serverUser.TerritoryBonus : undefined);
    self.attacks = ko.observable(serverUser ? serverUser.Attacks : undefined);  
    self.factionId = ko.observable(serverUser ? serverUser.FactionId : undefined);  

    // used in the autocomplete, because it apparently can't read observables
    self.name = self.username();
    
    self.username.subscribe(function(newName) {
        self.name = newName;
    });

    self.hasPermission = function(permissionId) {
        return $.inArray(permissionId, self.permissions()) > -1;
    };
    
    self.clone = function() {
        var user = new User();
        user.id(self.id());
        user.username(self.username());
        user.email(self.email());
        user.territoryBonus(self.territoryBonus());
        user.attacks(self.attacks());
        user.factionId(self.factionId());
        user.isLoggedIn(self.isLoggedIn());
        return user;
    };
    
    self.setFromJson = function(jsonUser) {
        self.id(jsonUser.Id);
        self.username(jsonUser.Name);
        self.email(jsonUser.Email);
        self.permissions($.map(jsonUser.Permissions, function(serverPermission) { return serverPermission.Id; }));
        self.territoryBonus(jsonUser.TerritoryBonus);
        self.attacks(jsonUser.Attacks);
        self.factionId(jsonUser.FactionId);
    };

    self.setFromCampaignData = function(jsonCampaignData) {
        self.territoryBonus(jsonCampaignData.TerritoryBonus);
        self.attacks(jsonCampaignData.Attacks);
        self.factionId(jsonCampaignData.FactionId);
    };
    
    self.clearCampaignData = function() {
        self.factionId(undefined);
        self.territoryBonus(undefined);
        self.attacks(undefined);
    };
};