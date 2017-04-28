/*exported TagListViewModel */
/*globals ko, TagListItemViewModel */
var TagListViewModel = function(currentCampaign, userCampaignData) {
    var self = this;
    
    self.territories = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return [];
        
        return $.map(campaign.territories(), function(territory) {
            return new TagListItemViewModel(territory);
        });
    });
    
    self.hasJoinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });
    
    self.isAdmin = ko.computed(function() {
        var data = userCampaignData();
        return data ? data.IsAdmin : false;        
    });
};