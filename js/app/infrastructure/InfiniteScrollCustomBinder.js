/*globals ko, _ */
ko.bindingHandlers.infiniteScroll = {
    init: function(elementDom, valueAccessor) {
        var addMoreFunction = ko.utils.unwrapObservable(valueAccessor());
            
        (function() {
            var lastScrollTop = 0;
            
            $(window).scroll(_.throttle(function() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop,
                    remaining = document.documentElement.scrollHeight - (window.innerHeight + scrollTop),
                    down = scrollTop > lastScrollTop;
                    
                lastScrollTop = scrollTop;
                if(down && remaining <= 100) {
                    addMoreFunction();
                }
            }, 100));
        })();
    }
};

