var Campaign = function(serverCampaign) {
    var self = this;
    
    self.id = ko.observable(serverCampaign ? serverCampaign.Id : '');
    self.name = ko.observable(serverCampaign ? serverCampaign.Name : '');
    self.factions = ko.observableArray();
    
    if(serverCampaign) {
        self.factions($.map(serverCampaign.Factions, function(serverFaction) {
            return new Faction(serverFaction);
        }));
    }
    
    self.clone = function() {
        var newCampaign = new Campaign();
        newCampaign.id(self.id());
        newCampaign.name(self.name());
        newCampaign.factions($.map(self.factions(), function(faction) {
            return faction.clone();
        }));
        return newCampaign;
    };
}