/*globals ko, Image */
ko.bindingHandlers.canvas = {
    update: function(canvas, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor()),
            context = canvas.getContext('2d');
            
        function loadImage() {            
            if(!params.url()) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
            
            var $canvas = $(canvas);
            setTimeout(function() {
                $canvas.panzoom({ panOnlyWhenZoomed: true }); 
            }, 0);

            var image = new Image();
            image.src = params.url();
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                
                context.drawImage(image, 
                    /* source */ 0, 0, image.width, image.height,
                    /* destination */ 0, 0, canvas.width, canvas.height);
                params.onLoad();
                
                setTimeout(function() {
                    // set the height of the map-panel to be the same ratio as the map ratio.
                    var ratio = image.height / image.width,
                    mapPanel = $(canvas).parent('.map-panel'),
                    mapPanelWidth = mapPanel.width();
                    mapPanel.css('height', mapPanelWidth * ratio);
                
                    // zoom so that the user can initially see the entire map.
                    var zoom = mapPanelWidth / image.width;
                    $(canvas).panzoom('zoom', zoom);
                    
                    // Positioning is doing weird things initially, move the canvas so it's in the corner.
                    var position = $(canvas).position();
                    $(canvas).panzoom('setMatrix', [zoom, 0, 0, zoom, -1 * position.left, -1 * position.top]);
                }, 0);             
            };
        }
        loadImage();
    }
};