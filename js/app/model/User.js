/*exported User */
/*globals ko */
var User = function(id, username, serverUserCampaignData) {
    var self = this,
        userCampaignDataList = ko.observable(serverUserCampaignData);
    
    self.id = ko.observable(id);
    self.username = ko.observable(username);
    self.isLoggedIn = ko.observable(false);
    self.permissions = ko.observableArray();

    self.hasPermission = function(permissionId) {
        return $.inArray(permissionId, self.permissions()) > -1;
    };
    
    self.clone = function() {
        var user = new User(self.id(), self.username(), userCampaignDataList);
        user.isLoggedIn(self.isLoggedIn());
        return user;
    };
    
    self.setFromJson = function(jsonUser) {
        self.id(jsonUser.Id);
        self.username(jsonUser.Name);
        self.permissions($.map(jsonUser.Permissions, function(serverPermission) { return serverPermission.Id; }));
        userCampaignDataList(jsonUser.UserCampaignData);
    };
    
    self.getAvailableTerritoryBonusForCampaign = function(campaignId) {
        var availableTerritoryBonus = 0;
        $.each(userCampaignDataList(), function(index, userCampaignData) {
            if(userCampaignData.CampaignId === campaignId) {
                availableTerritoryBonus = userCampaignData.TerritoryBonus;
                return false;
            }
            return true;
        });
        return availableTerritoryBonus;        
    };
};