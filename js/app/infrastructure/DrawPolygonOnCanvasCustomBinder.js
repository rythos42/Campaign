/*globals ko */
ko.bindingHandlers.drawPolygonOnCanvas = {
    update: function(canvas, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor()),
            polygon = params.polygon();
            
        if(!polygon)
            return;
        
        var context = canvas.getContext('2d');
        context.fillStyle = (params.colour && params.colour().getRgbaString(0.5))
            || 'rgba(255, 255, 255, 0.5)';
        
        var points = polygon.Points;
        context.beginPath();
        context.moveTo(points[0].X, points[0].Y);
        for(var i = 1; i < points.length; i ++){
            context.lineTo(points[i].X, points[i].Y);
        }
        context.closePath();
        context.fill();
    }
};