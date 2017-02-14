var CampaignListViewModel = function(navigation) {
    var self = this,
        internalCampaignList = ko.observableArray();
    
    self.campaignListFilter = ko.observable();
    
    self.showCampaignList = ko.computed(function() {
        return navigation.showMain();
    });
    
    self.campaignList = ko.computed(function() {
        var filter = self.campaignListFilter()
            campaignList = !filter
                ? internalCampaignList()
                : $.grep(internalCampaignList(), function(campaign) { return campaign.name().indexOf(filter) !== -1; });
                
        return $.map(campaignList, function(campaign) {
            return new CampaignListItemViewModel(campaign, navigation);
        });
    });
    
    self.hasCampaigns = ko.computed(function() {
        return self.campaignList().length > 0;
    });
    
    navigation.showMain.subscribe(function(show) {
        if(!show)
            return;
        
        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        
        if(newCampaign instanceof Campaign)
            internalCampaignList.push(newCampaign);
    });
    
    self.getCampaignList = function() {
        var params = { action: 'GetCampaignList' };
        
        $.ajax({
            url: '/src/webservices/CampaignService.php',
            method: 'GET',
            data: params,
            dataType: 'JSON',
            success: function(serverCampaignList) {
                internalCampaignList($.map(serverCampaignList, function(serverCampaign) {
                    return new Campaign(serverCampaign);
                }));
            }
        });
    };
    
    self.getCampaignList();
};