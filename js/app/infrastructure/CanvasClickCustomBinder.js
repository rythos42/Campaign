/*globals ko */
ko.bindingHandlers.canvasClick = {
    init: function(elementDom, valueAccessor) {
        var clickHandler = ko.utils.unwrapObservable(valueAccessor());
        var isDragging = false;
        var startingPos = [];
        $(elementDom)
            .mousedown(function (evt) {
                isDragging = false;
                startingPos = [evt.pageX, evt.pageY];
            })
            .mousemove(function (evt) {
                if (!(evt.pageX === startingPos[0] && evt.pageY === startingPos[1])) {
                    isDragging = true;
                }
            })
            .mouseup(function () {
                if (!isDragging)
                    clickHandler();
                isDragging = false;
                startingPos = [];
            });
    }
};