/*globals ko */
ko.bindingHandlers.resizeOnWindowResize = {
    init: function(elementToResizeDom) {
        $(window).resize(function() {
            var elementToResize = $(elementToResizeDom);
            elementToResize.css('width', elementToResize.parent().width());
        });
    }
};