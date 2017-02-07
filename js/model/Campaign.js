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
}