/*exported CampaignEntry */
/*globals ko, Faction, User, CampaignFactionEntry */
var CampaignEntry = function(campaignId, serverCampaignEntry) {
    var self = this;
    
    self.createdOnDate = ko.observable(serverCampaignEntry ? serverCampaignEntry.CreatedOnDate : undefined);
    self.campaignId = ko.observable(campaignId ? campaignId : undefined);
    self.factionEntries = ko.observableArray();
    
    if(serverCampaignEntry) {
        $.each(serverCampaignEntry.CampaignFactionEntrys, function(serverCampaignFactionEntry) {
            var faction = new Faction(serverCampaignFactionEntry.FactionName);
            var user = new User(serverCampaignFactionEntry.UserId, serverCampaignFactionEntry.Username);
            var factionEntry = new CampaignFactionEntry(faction, user, serverCampaignFactionEntry.VictoryPointsScored);
            self.factionEntries.push(factionEntry);
        });
    }
    
    self.clear = function() {
        self.campaignId(undefined);
        self.factionEntries.removeAll();
    };
};