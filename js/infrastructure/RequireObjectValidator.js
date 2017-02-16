ko.validation.rules.requireObject = {
    validator: function (value) {
        return typeof(value) === 'object';
    }
};