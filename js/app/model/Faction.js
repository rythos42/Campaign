/*exported Faction */
/*globals ko */
var Faction = function(factionName, factionId, factionColour) {
    var self = this;
    
    self.id = ko.observable();
    self.name = ko.observable();
    self.colour = ko.observable();
    
    if(typeof(factionName) === 'object') {
        self.id(factionName.Id);
        self.name(factionName.Name);
    } else {
        self.id(factionId);
        self.name(factionName);
        self.colour(factionColour);
    }
    
    self.clone = function() {
        var faction = new Faction();
        faction.id(self.id());
        faction.name(self.name());
        faction.colour(self.colour());
        return faction;
    };
};