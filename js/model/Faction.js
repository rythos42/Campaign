var Faction = function(factionName) {
	var self = this;
	
	self.id = ko.observable();
	self.name = ko.observable();
	
	if(typeof(factionName) === 'object') {
		self.id(factionName.Id);
		self.name(factionName.Name);
	} else {
		self.name(factionName);
	}
};