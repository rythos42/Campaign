ko.bindingHandlers.autocomplete = {
    init: function(elementDom, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor());        
        
        $(elementDom).autocomplete({
            source: function(request, responseCallback) {
                var url = request.term.indexOf('?') !== -1
                    ? params.url + '?term=' + request.term
                    : params.url + '&term=' + request.term;
                    
                $.ajax({
                    url: url,
                    dataType: 'JSON',
                    success: function(results) {
                        responseCallback($.map(results, function(result) {
                            return { value: result[params.label] };
                        }));
                    }
                });
            }
        });
    }
};