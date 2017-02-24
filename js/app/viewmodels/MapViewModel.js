/*exported MapViewModel */
/*globals ko */
var MapViewModel = function(navigation, currentCampaign, currentEntry) {
    var self = this,
        adjacentTerritories = ko.observableArray(),
        originalImageData;
    
    self.mapImageUrl = ko.observable();
    self.drawingTerritory = ko.observable();
    self.selectedTerritory = ko.observable();
        
    self.showMap = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return false;
        
        return campaign.campaignType() === 1 && navigation.showCampaignEntry();
    });
    
    function getAdjacentTerritoriesForFaction(factionId) {
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            dataType: 'JSON',
            data: {
                action: 'GetAdjacentTerritoriesForFaction',
                factionId: factionId
            },
            success: function(newAdjacentTerritories) {
                adjacentTerritories(newAdjacentTerritories);
            }
        });
    }
    
    currentEntry.attackingFaction.subscribe(function(attackingFaction) {
        if(!attackingFaction) {
            adjacentTerritories([]);
            return;
        }
        
        getAdjacentTerritoriesForFaction(attackingFaction.id());
    });

    
    self.drawTerritory = function(viewModel, event) {
        if(self.selectedTerritory())
            return;

        if(originalImageData)   // conditional shouldn't be needed, but it kept throwing...
            getCanvas().getContext('2d').putImageData(originalImageData, 0, 0);
        
        var actualPoint = getMousePositionInCanvas(event),
            foundTerritory = false;
            
        $.each(adjacentTerritories(), function(index, territory) {
            if(isPointInPolygon({x: actualPoint.x, y: actualPoint.y}, territory.Points)) {
                territory.Points.sort(function(point1, point2){
                    return point1.PointNumber > point2.PointNumber;
                });
                self.drawingTerritory(territory);
                foundTerritory = true;
            }
        });
        
        if(!foundTerritory)
            self.drawingTerritory(null);
    };
    
    self.selectTerritory = function() {
        // if there is a territory selected, unselect it
        if(self.selectedTerritory())
            self.selectedTerritory(null);

        // if we're hovering over a territory, select it
        if(self.drawingTerritory()) {
            self.selectedTerritory(self.drawingTerritory());
            self.drawingTerritory(null);
        }
    };
    
    self.clearMap = function() {
        self.mapImageUrl(null);
        self.drawingTerritory(null);
        self.selectedTerritory(null);
        originalImageData = null;
    };
    
    function getCanvas() {
        // Putting DOM stuff into ViewModels is bad, but I think this is less bad than several alternatives.
        return document.getElementById('MapCanvas');
    }
    
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

    self.updateImage = function() {
        var canvas = getCanvas();
        originalImageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    };
    
    currentCampaign.subscribe(function(newCampaign) {
        self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + newCampaign.id());
    });
};