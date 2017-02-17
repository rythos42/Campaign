var CampaignFactionEntry = function(faction, user, victoryPoints) {
    var self = this;
    
    self.faction = ko.observable(faction ? faction : undefined);
    self.user = ko.observable(user ? user : undefined);
    self.victoryPoints = ko.observable(victoryPoints ? victoryPoints : undefined);
    
    self.clone = function() {
        var campaignFactionEntry = new CampaignFactionEntry();
        campaignFactionEntry.faction(self.faction().clone());
        campaignFactionEntry.user(self.user().clone());
        campaignFactionEntry.victoryPoints(self.victoryPoints());
        return campaignFactionEntry;
    };
};