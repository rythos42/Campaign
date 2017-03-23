/*exported PlayerListViewModel */
/*globals ko, PlayerListItemViewModel, UserManager, User */
var PlayerListViewModel = function(currentCampaign) {
    var self = this,
        internalPlayers = ko.observableArray();
            
    self.players = ko.computed(function() {
        return $.map(internalPlayers(), function(user) {
            return new PlayerListItemViewModel(user);
        });
    });
    
    currentCampaign.subscribe(function(campaign) {
        UserManager.getUsersForCampaign(campaign.id()).done(function(results) {
            internalPlayers($.map(results, function(serverUser) {
                return new User(serverUser.Id, serverUser.Username, serverUser.TerritoryBonus, serverUser.Attacks);
            }));
        });
    });
};