/*exported CampaignListItemViewModel */
var CampaignListItemViewModel = function(campaign, navigation) {
    var self = this;
    
    self.id = campaign.id;
    self.name = campaign.name;
    
    self.showInProgressCampaign = function() {
        navigation.parameters(campaign);
        navigation.isSideBarOpen(false);
        
        if(navigation.showInProgressCampaign()) 
            navigation.showInProgressCampaign.notifySubscribers(true);
        else
            navigation.showInProgressCampaign(true);
    };
};