/*globals ko, MapHelper */
ko.bindingHandlers.drawPolygonOnCanvas = {
    update: function(canvas, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor()),
            polygon = params.polygon();
            
        if(!polygon)
            return;
        
        var helper = new MapHelper(canvas);
        helper.drawTerritory(polygon, params.colour);
    }
};