/*exported MapLegendViewModel */
var MapLegendViewModel = function(faction) {
    var self = this;
    
    self.name = faction.name;
    
    self.colour = ko.computed(function() {
        return ColourHelper.rgbToHex(faction.colour());
    });
};