/*exported CampaignType */
var CampaignType = {
    setCampaignTypes: function(jsonTypes) {
        $.each(jsonTypes, function(typeName, typeValue) {
            CampaignType[typeName] = typeValue;
        });
    }
};

