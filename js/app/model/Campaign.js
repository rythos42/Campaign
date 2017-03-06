/*exported Campaign */
/*globals ko, Faction */
var Campaign = function(serverCampaign) {
    var self = this;
    
    self.id = ko.observable(serverCampaign ? serverCampaign.Id : '');
    self.name = ko.observable(serverCampaign ? serverCampaign.Name : '');
    self.campaignType = ko.observable(serverCampaign ? serverCampaign.CampaignType : undefined);
    self.createdByUserId = ko.observable(serverCampaign ? serverCampaign.CreatedByUserId : undefined);
    self.factions = ko.observableArray();
    self.mandatoryAttacks = ko.observable();
    self.optionalAttacks = ko.observable();
    
    if(serverCampaign) {
        self.factions($.map(serverCampaign.Factions, function(serverFaction) {
            return new Faction(serverFaction);
        }));
    }
    
    self.isMapCampaign = function() {
        return parseInt(self.campaignType(), 10) === 1;
    };
    
    self.clone = function() {
        var newCampaign = new Campaign();
        newCampaign.id(self.id());
        newCampaign.name(self.name());
        newCampaign.factions($.map(self.factions(), function(faction) {
            return faction.clone();
        }));
        return newCampaign;
    };
};