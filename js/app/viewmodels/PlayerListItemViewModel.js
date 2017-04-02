/*exported PlayerListItemViewModel */
/*globals ko */
var PlayerListItemViewModel = function(user, currentCampaign) {
    var self = this;
    
    self.username = user.username;
    self.attacks = user.attacks;    
    
    self.factionName = ko.computed(function() {
        return currentCampaign().getFactionById(user.factionId()).name();
    });
};