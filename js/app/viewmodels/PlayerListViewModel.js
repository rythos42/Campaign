/*exported PlayerListViewModel */
/*globals ko, PlayerListItemViewModel, UserManager, User */
var PlayerListViewModel = function(currentCampaign) {
    var self = this;
            
    self.players = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return;
        
        return $.map(campaign.players(), function(user) {
            return new PlayerListItemViewModel(user, currentCampaign);
        });
    });
    
    self.loadedPlayersPromise = null;
    
    currentCampaign.subscribe(function(campaign) {
        if(!campaign)
            return;
        
        self.loadedPlayersPromise = $.Deferred();
        
        UserManager.getUsersForCampaign(campaign.id()).done(function(results) {
            currentCampaign().players($.map(results, function(serverUser) {
                return new User(serverUser);
            }));
            self.loadedPlayersPromise.resolve();            
        });
    });
};