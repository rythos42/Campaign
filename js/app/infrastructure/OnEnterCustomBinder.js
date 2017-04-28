/*globals ko */
ko.bindingHandlers.onEnter = {
    init: function(elementDom, valueAccessor) {
        var onEnterHandler = ko.utils.unwrapObservable(valueAccessor());
        $(elementDom).keypress(function(event) {
            if(event.keyCode === 13)
                onEnterHandler();
        });
    }
};