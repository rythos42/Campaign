/*globals ko */
ko.validation.rules.uniqueIn = {
    validator: function (value, params) {
        var arrayObjectProperty = params.arrayObjectProperty,
            array = params.array,
            found = false;
            
        $.each(array(), function(index, arrayItem) {
            if(arrayItem[arrayObjectProperty]() === value) {
                found = true;
                return false;
            }
            return true;
        });
        
        return !found;
    }
};