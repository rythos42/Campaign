var CampaignEntry = function() {
    var self = this;
    
    self.campaignId = ko.observable();
    self.factionEntries = ko.observableArray();
    
    self.clear = function() {
        self.campaignId(undefined);
        self.factionEntries.removeAll();
    };
};