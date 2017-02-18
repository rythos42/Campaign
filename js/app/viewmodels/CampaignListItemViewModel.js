/*exported CampaignListItemViewModel */
var CampaignListItemViewModel = function(campaign, navigation) {
    var self = this;
    
    self.id = campaign.id;
    self.name = campaign.name;
    
    self.createCampaignEntry = function() {
        navigation.parameters(campaign);
        navigation.showCampaignEntry(true);
    };
};