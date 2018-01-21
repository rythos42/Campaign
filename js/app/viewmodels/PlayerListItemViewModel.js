/*exported PlayerListItemViewModel */
/*globals ko */
var PlayerListItemViewModel = function(user, playerUser, currentCampaign, reloadEvents) {
    var self = this;
    
    self.username = playerUser.username;
    self.attacks = playerUser.attacks; 
    self.territoryBonus = playerUser.territoryBonus;
    self.isPlayerAdmin = playerUser.isAdminForCurrentCampaign;
    self.isUserAdmin = user.isAdminForCurrentCampaign;
    
    self.canChangeAdminStatus = ko.computed(function() {
        // Only change if you're an admin, and you can't change yourself.
        return user.isAdminForCurrentCampaign() && user.id() !== playerUser.id();
    });
    
    self.factionName = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return '';
        
        var faction = campaign.getFactionById(playerUser.factionId());
        return faction ? faction.name() : '';
    });
    
    self.giveTerritoryBonus = function() {
        $.ajax({
            url: 'src/webservices/UserService.php',
            data: {
                action: 'GiveTerritoryBonusInCampaignTo',
                userId: playerUser.id(),
                campaignId: currentCampaign().id(),
                amount: 1,
                takeFromMe: false
            }
        }).then(function() {
            reloadEvents.reloadSummary();
        });
    };
    
    playerUser.isAdminForCurrentCampaign.subscribe(function(isAdminForCurrentCampaign) {
        $.ajax({
            url: 'src/webservices/UserService.php',
            data: {
                action: 'SetUserAdminForCampaign',
                campaignId: currentCampaign().id(),
                userId: playerUser.id(),
                isAdminForCurrentCampaign: isAdminForCurrentCampaign
            }
        });
    });
    
    self.approveJoinRequest  = function() {
        var playerUserId = playerUser.id(),
            campaignId = currentCampaign().id();
        
        $.ajax({
            url: 'src/webservices/UserService.php',
            data: {
                action: 'ApproveJoinRequest',
                campaignId: campaignId,
                userId: playerUserId
            }
        }).then(function() {
            reloadEvents.reloadPlayers();
        });
    };
};