/*exported TagListViewModel */
/*globals ko, TagListItemViewModel */
var TagListViewModel = function(currentCampaign) {
    var self = this;
    
    self.territories = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return [];
        
        return $.map(campaign.territories(), function(territory) {
            return new TagListItemViewModel(territory);
        });
    });
};