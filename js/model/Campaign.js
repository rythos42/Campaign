var Campaign = function() {
	var self = this;
	
	self.name = ko.observable('');
	self.factions = ko.observableArray();
}