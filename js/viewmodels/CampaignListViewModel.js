var CampaignListViewModel = function(navigation) {
    var self = this,
        internalCampaignList = ko.observableArray();
    
    self.campaignListFilter = ko.observable();
    
    self.showCampaignList = ko.computed(function() {
        return navigation.showMain();
    });
    
    self.campaignList = ko.computed(function() {
        var filter = self.campaignListFilter();
        if(!filter)
            return internalCampaignList();
        
        return $.grep(internalCampaignList(), function(campaign) {
            return campaign.name().indexOf(filter) !== -1;
        });
    });
    
    self.getCampaignList = function() {
        var params = { action: 'GetCampaignList' };
        
        $.ajax({
            url: '/src/webservices/CampaignService.php',
            method: 'GET',
            data: params,
            dataType: 'JSON',
            success: function(serverCampaignList) {
                internalCampaignList($.map(serverCampaignList, function(campaign) {
                    return new CampaignListItemViewModel(new Campaign(campaign), navigation);
                }));
            }
        });
    };
    
    self.getCampaignList();
};