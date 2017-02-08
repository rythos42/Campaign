var ExceptionCodes = {
    setCodes: function(jsonCodes) {
        $.each(jsonCodes, function(codeName, codeValue) {
            // response text is a string, so codes are strings for ease of comparing
            ExceptionCodes[codeName] = codeValue + '';
        });
    }
};

