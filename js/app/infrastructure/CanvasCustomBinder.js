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
            
            // set initial size based on parent size
            var $canvas = $(canvas);
            $canvas.css('width', $canvas.parent().width() - 20);    // it was initially giving a scroll bar

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