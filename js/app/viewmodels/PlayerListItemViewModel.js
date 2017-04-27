/*exported PlayerListItemViewModel */
/*globals ko */
var PlayerListItemViewModel = function(user, playerUser, currentCampaign) {
    var self = this;
    
    self.username = playerUser.username;
    self.attacks = playerUser.attacks;    
    self.isPlayerAdmin = playerUser.isAdminForCurrentCampaign;
    
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
};