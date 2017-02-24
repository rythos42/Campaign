/*globals ko, Image */
ko.bindingHandlers.canvas = {
    update: function(canvas, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor()),
            context = canvas.getContext('2d'),
            zoomed = params.zoomed;
            
        function loadImage() {            
            if(!params.url()) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            var image = new Image();
            image.src = params.url();
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                
                var imageWidth = zoomed() ? image.width / 2 : image.width;
                var imageHeight = zoomed() ? image.height / 2 : image.height;
                
                context.drawImage(image, 
                    /* source */ 0, 0, imageWidth, imageHeight,
                    /* destination */ 0, 0, canvas.width, canvas.height);
                params.onLoad();
            };
        }
        loadImage();
        
        zoomed.subscribe(function() {
            loadImage();
        });
    }
};