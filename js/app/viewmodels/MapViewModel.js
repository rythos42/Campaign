/*exported MapViewModel */
var MapViewModel = function(navigation, currentCampaign) {
    var self = this,
        adjacentPolygons = ko.observableArray();
    
    self.mapImageUrl = ko.observable();
    self.drawingPolygon = ko.observable();
    
    
    self.showMap = ko.computed(function() {
        return navigation.showCampaignEntry();
    });
    
    function getAdjacentTerritoriesForCampaign(campaignId) {
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            dataType: 'JSON',
            data: {
                action: 'GetAdjacentTerritoriesForCampaign',
                campaignId: campaignId
            },
            success: function(newAdjacentPolygons) {
                adjacentPolygons(newAdjacentPolygons);
            }
        });
    };
    
    var drawingSurfaceImageData;
    
    self.drawPolygon = function(viewModel, event) {
        var canvas = $('canvas')[0],
            context = canvas.getContext('2d');
        if(drawingSurfaceImageData)
            context.putImageData(drawingSurfaceImageData, 0, 0);
        
        var actualPoint = getMousePositionInCanvas(canvas, event);
        $.each(adjacentPolygons(), function(index, polygon) {
            if(isPointInPolygon({x: actualPoint.x, y: actualPoint.y}, polygon.Points)) {
                polygon.Points.sort(function(point1, point2){
                    return point1.PointNumber > point2.PointNumber;
                });
                drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
                self.drawingPolygon(polygon);
            }
        });
    };
    
    function getMousePositionInCanvas(canvas, evt) {
        // http://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
        var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        }
    }
        
    function isPointInPolygon(p, polygon) {
        // http://stackoverflow.com/questions/16628184/add-onclick-and-onmouseover-to-canvas-element
        var isInside = false,
            minX = polygon[0].X, maxX = polygon[0].X;
            minY = polygon[0].Y, maxY = polygon[0].Y;
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
            if ( (polygon[i].Y > p.y) != (polygon[j].Y > p.y) &&
                    p.x < (polygon[j].X - polygon[i].X) * (p.y - polygon[i].Y) / (polygon[j].Y - polygon[i].Y) + polygon[i].X ) {
                isInside = !isInside;
            }
        }

        return isInside;
    }
    
    self.updateImage = function() {
        getAdjacentTerritoriesForCampaign(currentCampaign().id());
    };
    
    currentCampaign.subscribe(function(newCampaign) {
        var campaignId = newCampaign.id();
        self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + newCampaign.id());
    });
};