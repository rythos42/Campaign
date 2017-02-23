/*globals ko, Image */
ko.bindingHandlers.canvas = {
    update: function(canvas, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor());
        if(!params.url())
            return;
        
        var context = canvas.getContext('2d'),
            image = new Image();
            
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