/*globals ko */
ko.bindingHandlers.tooltip = {
    init: function(elementDom, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor());
        $(elementDom).tooltip({
            content: params, 
            items: elementDom
        });
        
        $(elementDom).addClass('tooltip-element');
    }
};