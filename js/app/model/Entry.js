/*exported Entry */
/*globals ko, Faction, User, FactionEntry */
var Entry = function(campaignId, serverEntry) {
    var self = this;
    
    self.createdOnDate = ko.observable(serverEntry ? serverEntry.CreatedOnDate : undefined);
    self.campaignId = ko.observable(campaignId ? campaignId : undefined);
    self.factionEntries = ko.observableArray();
    self.usersFaction = ko.observable();
    
    if(serverEntry) {
        $.each(serverEntry.CampaignFactionEntries, function(index, serverFactionEntry) {
            var faction = new Faction(serverFactionEntry.FactionName, serverFactionEntry.CampaignFactionId);
            var user = new User(serverFactionEntry.UserId, serverFactionEntry.Username);
            var factionEntry = new FactionEntry(faction, user, serverFactionEntry.VictoryPointsScored);
            self.factionEntries.push(factionEntry);
        });
    }
    
    self.clear = function() {
        self.campaignId(undefined);
        self.factionEntries.removeAll();
    };
};