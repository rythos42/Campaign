/*exported ColourHelper */
/*globals Colour */
var ColourHelper = {
    golden_ratio_conjugate: 0.618033988749895,
    lastHue: Math.random(),
    generateNextRandom: function() {
        this.lastHue += this.golden_ratio_conjugate;
        this.lastHue %= 1
        return this.hsvToRgb(this.lastHue, 0.5, 0.95);
    },    
    hsvToRgb: function(h, s, v) {
        // From http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1)
            s = h.s, v = h.v, h = h.h;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return new Colour(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    },
    rgbToHex: function(colour) {
        function toHex(n) {
            n = parseInt(n, 10);
            if(isNaN(n)) 
                return "00";
            
            n = Math.max(0, Math.min(n, 255));
            return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
        }
        
        return toHex(colour.getRed())+toHex(colour.getGreen())+toHex(colour.getBlue())
    },
};