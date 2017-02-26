/*exported MapHelper */
var MapHelper = function(mapId) {
    var self = this,
        originalImageData;
            
    function getCanvas() {
        return document.getElementById(mapId);
    }
    
    self.restoreImage = function() {
        if(originalImageData)   // conditional shouldn't be needed, but it kept throwing...
            getCanvas().getContext('2d').putImageData(originalImageData, 0, 0);
    };
    
    self.clearImageData = function() {
        originalImageData = null;
    };
    
    self.storeImage = function() {
        var canvas = getCanvas();
        originalImageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    };
    
    self.findPolygonUnderMouseEvent = function(territories) {
        var actualPoint = getMousePositionInCanvas(event),
            foundTerritory = null;
        
        $.each(territories, function(index, territory) {
            if(isPointInPolygon({x: actualPoint.x, y: actualPoint.y}, territory.Points)) {
                territory.Points.sort(function(point1, point2){
                    return point1.PointNumber > point2.PointNumber;
                });
                foundTerritory = territory;
                return false;
            }
            return true;
        });
        
        return foundTerritory;
    };
    
    function getMousePositionInCanvas(evt) {
        // http://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
        var canvas = getCanvas(),
            rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }
        
    function isPointInPolygon(p, polygon) {
        // http://stackoverflow.com/questions/16628184/add-onclick-and-onmouseover-to-canvas-element
        var isInside = false,
            minX = polygon[0].X, 
            maxX = polygon[0].X,
            minY = polygon[0].Y, 
            maxY = polygon[0].Y;
            
        for (var n = 1; n < polygon.length; n++) {
            var q = polygon[n];
            minX = Math.min(q.X, minX);
            maxX = Math.max(q.X, maxX);
            minY = Math.min(q.Y, minY);
            maxY = Math.max(q.Y, maxY);
        }

        if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY)
            return false;

        var i = 0, j = polygon.length - 1;
        for (i, j; i < polygon.length; j = i++) {
            if ( (polygon[i].Y > p.y) !== (polygon[j].Y > p.y) &&
                    p.x < (polygon[j].X - polygon[i].X) * (p.y - polygon[i].Y) / (polygon[j].Y - polygon[i].Y) + polygon[i].X ) {
                isInside = !isInside;
            }
        }

        return isInside;
    }
};