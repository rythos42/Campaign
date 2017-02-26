/*exported MapLegendViewModel */
/*globals ko, ColourHelper */
var MapLegendViewModel = function(faction) {
    var self = this;
    
    self.name = faction.name;
    self.id = faction.id;    
    
    self.colour = ko.computed(function() {
        return ColourHelper.rgbToHex(faction.colour());
    });
};