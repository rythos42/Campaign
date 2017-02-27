/*exported Colour */
var Colour = function(r, g, b) {
    var self = this;
    
    self.getRed = function() { return r; };
    self.getGreen = function() { return g; };
    self.getBlue = function() { return b; };
    
    self.getRgbaString = function(alpha) {
        return 'rgba(' + self.getRed() + ', ' + self.getGreen() + ', ' + self.getBlue() + ', ' + alpha + ')';
    };
};