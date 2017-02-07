var Campaign = function(serverCampaign) {
	var self = this;
	
	self.name = ko.observable(serverCampaign ? serverCampaign.Name : '');
	self.factions = ko.observableArray();
}