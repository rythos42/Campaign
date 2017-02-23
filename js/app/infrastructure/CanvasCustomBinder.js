/*globals ko, Image */
ko.bindingHandlers.canvas = {
    update: function(canvas, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor()),
            context = canvas.getContext('2d');
            
        if(!params.url()) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        
        var image = new Image();
        image.src = params.url();
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 
                0, 0, image.width, image.height,
                0, 0, canvas.width, canvas.height);
            params.onLoad();
        };
    }
};