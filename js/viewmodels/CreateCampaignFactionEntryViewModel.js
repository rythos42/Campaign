var CreateCampaignFactionEntryViewModel = function(campaignObs, campaignEntry) {
    var self = this,
        campaignFactionEntry = new CampaignFactionEntry();
    
    self.selectedFaction = campaignFactionEntry.faction;
    self.selectedUser = campaignFactionEntry.user;
    self.victoryPoints = campaignFactionEntry.victoryPoints;
    
    self.availableFactions = ko.computed(function() {
        var campaignObj = campaignObs();
        return campaignObj ? campaignObj.factions() : null;
    });
    
    self.addFaction = function() {
        campaignEntry.factionEntries.push($.extend({}, campaignFactionEntry));
    };
};