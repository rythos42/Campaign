var Translation = {
    setTranslations: function(translationJson) {
        this.__strings = translationJson.strings;
    },
    getString: function(key) {
        return this.__strings[key];
    }
};