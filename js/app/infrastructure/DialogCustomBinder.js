/*globals ko */
ko.bindingHandlers.dialog = {
    init: function(elementDom, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor());
        
        params = $.extend(params, {
            autoOpen: false,
            modal: true,
            position: { my: 'top', at: 'top+150px', of: window },
            close: function() {
                $('.tooltip-element').tooltip('close'); // jquery tooltip appears again after dialog close for Give TB dialog
            }
        });
         
        $(elementDom).dialog(params);
    }
};

ko.bindingHandlers.dialogOpenClose = {
    init: function(elementDom, valueAccessor) {
        var shouldOpen = valueAccessor();
        $(elementDom).dialog({
            beforeClose: function() {
                shouldOpen(false);
            }
        });
    },
    update: function(elementDom, valueAccessor) {
        var shouldOpen = ko.utils.unwrapObservable(valueAccessor());
        if(shouldOpen)
            $(elementDom).dialog('open');
        else
            $(elementDom).dialog('close');
    }
};