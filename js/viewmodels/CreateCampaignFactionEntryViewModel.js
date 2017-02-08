var CreateCampaignFactionEntryViewModel = function(campaignObs) {
    var self = this;
    
    self.selectedFaction = ko.observable();
    self.selectedUser = ko.observable();
    
    self.factions = ko.computed(function() {
        var campaignObj = campaignObs();
        return campaignObj ? campaignObj.factions() : null;
    });
};