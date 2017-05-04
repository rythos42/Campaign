/*exported PlayerListViewModel */
/*globals ko, PlayerListItemViewModel, UserManager, User */
var PlayerListViewModel = function(user, currentCampaign, reloadEvents) {
    var self = this;
    
    self.isUserAdmin = user.isAdminForCurrentCampaign;
            
    self.players = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return;
        
        return $.map(campaign.players(), function(playerUser) {
            return new PlayerListItemViewModel(user, playerUser, currentCampaign, reloadEvents);
        });
    });
    
    self.loadedPlayersPromise = null;
    
    self.reloadPlayerList = function() {
        var campaign = currentCampaign();
        if(!campaign)
            return;
        
        self.loadedPlayersPromise = $.Deferred();

        UserManager.getUsersForCampaign(campaign.id()).done(function(results) {
            currentCampaign().players($.map(results, function(serverUser) {
                return new User(serverUser);
            }));
            self.loadedPlayersPromise.resolve();            
        });
    };
    
    currentCampaign.subscribe(function() {
        self.reloadPlayerList();
    });
};