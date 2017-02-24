/*globals ko */
ko.validation.rules.mustContain = {
    validator: function (list, params) {
        var objectProperty = params.objectProperty,
            searchFor = params.searchFor,
            found = false;
            
        $.each(list, function(index, value) {
            if(value[objectProperty]() === searchFor) {
                found = true;
                return false;
            }
            return true;
        });
        
        return found;
    }
};