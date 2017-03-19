ko.bindingHandlers.domColour = {
    update: function(elementDom, valueAccessor) {
        var colour = ko.utils.unwrapObservable(valueAccessor());

        $(elementDom).css('background-color', ColourHelper.rgbToHex(colour));
    }
};