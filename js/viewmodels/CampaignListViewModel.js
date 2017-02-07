var CampaignListViewModel = function(navigation) {
    var self = this;
    
    self.campaignList = ko.observableArray();
    
    self.showCampaignList = ko.computed(function() {
        return navigation.showMain();
    });
    
    self.getCampaignList = function() {
        var params = { action: 'GetCampaignList' };
        
        $.ajax({
            url: '/src/webservices/CampaignService.php',
            method: 'GET',
            data: params,
            dataType: 'JSON',
            success: function(campaignList) {
                self.campaignList($.map(campaignList, function(campaign) {
                    return new CampaignListItemViewModel(new Campaign(campaign));
                }));
                
            }
        });
    };
    
    self.getCampaignList();
};