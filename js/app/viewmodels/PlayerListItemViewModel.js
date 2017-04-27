/*exported PlayerListItemViewModel */
/*globals ko */
var PlayerListItemViewModel = function(user, currentCampaign) {
    var self = this;
    
    self.username = user.username;
    self.attacks = user.attacks;    
    
    self.factionName = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return '';
        
        var faction = campaign.getFactionById(user.factionId());
        return faction ? faction.name() : '';
    });
    
    self.isAdmin = ko.computed(function() {
        return user.isAdminForCurrentCampaign();
    });
};