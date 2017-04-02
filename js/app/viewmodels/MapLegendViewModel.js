/*exported MapLegendViewModel */
/*globals ko, ColourHelper */
var MapLegendViewModel = function(faction, user) {
    var self = this;
    
    self.name = faction.name;
    self.id = faction.id;    
    
    self.colour = ko.computed(function() {
        return ColourHelper.rgbToHex(faction.colour());
    });
    
    self.isMyFaction = ko.computed(function() {
        if(!user)
            return false;
        
        return faction.id() === user.factionId();
    });
};