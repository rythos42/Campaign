var CampaignFactionEntry = function() {
    var self = this;
    
    self.faction = ko.observable();
    self.user = ko.observable();
    self.victoryPoints = ko.observable();
    
    self.clone = function() {
        var campaignFactionEntry = new CampaignFactionEntry();
        campaignFactionEntry.faction(self.faction().clone());
        campaignFactionEntry.user(self.user().clone());
        campaignFactionEntry.victoryPoints(self.victoryPoints());
        return campaignFactionEntry;
    };
};