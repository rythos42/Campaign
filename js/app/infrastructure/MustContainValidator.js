/*globals ko */
ko.validation.rules.mustContain = {
    validator: function (list, params) {
        var objectProperty = params.objectProperty,
            searchFor = params.searchFor,
            comparisonProperty = params.comparisonProperty,
            found = false;
            
        $.each(list, function(index, value) {
            // This is a pretty awful conditional. To many observables in here.
            if(value[objectProperty]()[comparisonProperty]() === searchFor[comparisonProperty]()) {
                found = true;
                return false;
            }
            return true;
        });
        
        return found;
    }
};