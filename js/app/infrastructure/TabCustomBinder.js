/*globals ko */
ko.bindingHandlers.tab = {
    init: function(elementDom) {
        $(elementDom).tabs();
    }
};