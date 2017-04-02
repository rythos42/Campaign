/*globals ko */
ko.bindingHandlers.clickToZoomOut = {
    init: function(elementDom, valueAccessor) {
        var canvasSelector = ko.utils.unwrapObservable(valueAccessor());
        
        $(elementDom).click(function(event) {
            event.preventDefault();
            var zoomOut = true;
            $(canvasSelector).panzoom('zoom', zoomOut, {
                increment: 0.5,
                animate: false,
                focal: event
            });
        });
    }
};