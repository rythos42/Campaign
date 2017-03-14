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
            
            setTimeout(function() {
                // set initial size based on parent size
                var $canvas = $(canvas);
                $canvas.panzoom({
                    panOnlyWhenZoomed: true,
                    contain: 'invert'
                });

                $canvas.parent().on('mousewheel.focal', function( e ) {
                    e.preventDefault();
                    var delta = e.delta || e.originalEvent.wheelDelta;
                    var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                    $canvas.panzoom('zoom', zoomOut, {
                        increment: 0.1,
                        animate: false,
                        focal: e
                    });
                });
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
            };
        }
        loadImage();
    }
};