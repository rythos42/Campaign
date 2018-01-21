/*exported PlayerListViewModel */
/*globals ko, PlayerListItemViewModel, UserManager, User */
var PlayerListViewModel = function(user, currentCampaign, reloadEvents) {
    var self = this;
    
    self.isUserAdmin = user.isAdminForCurrentCampaign;
    self.requestingPlayers = ko.observableArray();
        
    self.players = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return;
        
        return $.map(campaign.players(), function(playerUser) {
            return new PlayerListItemViewModel(user, playerUser, currentCampaign, reloadEvents);
        });
    });
    
    self.hasRequestingPlayers = ko.computed(function() {
        var requestingPlayers = self.requestingPlayers();
        return requestingPlayers.length;
    });
    
    self.loadedPlayersPromise = null;
    
    self.reloadPlayerList = function() {
        var campaign = currentCampaign();
        if(!campaign)
            return;
        
        self.loadedPlayersPromise = $.Deferred();
        var campaignId = campaign.id();

        UserManager.getUsersForCampaign(campaignId).done(function(results) {
            currentCampaign().players($.map(results, function(serverUser) {
                return new User(serverUser);
            }));
            self.loadedPlayersPromise.resolve();            
        });
        
        $.ajax({
            url: 'src/webservices/UserService.php',
            dataType: 'JSON',
            data: {
                action: 'GetRequestingUsersForCampaign',
                campaignId: campaignId
            }            
        }).then(function(requestingPlayers) {
            self.requestingPlayers($.map(requestingPlayers, function(playerUser) {
                return new PlayerListItemViewModel(user, new User(playerUser), currentCampaign, reloadEvents);
            }));
        });;
    };
    
    currentCampaign.subscribe(function() {
        self.reloadPlayerList();
    });
};