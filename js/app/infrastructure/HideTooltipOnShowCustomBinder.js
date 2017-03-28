/*globals ko */
ko.bindingHandlers.hideTooltipOnShow = {
    init: function(elementDom) {
        $(elementDom).on('show', function() {
            var tooltip = $(this).siblings('.tooltip-element'),
                oldHide = tooltip.tooltip('option', 'hide');
                
            tooltip.tooltip('option', 'hide', false);   // cause it to immediately disappear, rather than fade out
            tooltip.tooltip('disable');                 // tooltip will come back moments later if we don't disable it. This also closes.
            tooltip.tooltip('option', 'hide', oldHide); // give it the fade-out again
            setTimeout(function() {
                tooltip.tooltip('enable');              // enable it after the user has had time to move the mouse
            }, 1000);
        });
    }
};