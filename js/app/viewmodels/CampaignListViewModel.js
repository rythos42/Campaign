/*exported CampaignListViewModel */
/*globals ko, CampaignListItemViewModel, Campaign */
var CampaignListViewModel = function(user, navigation) {
    var self = this,
        internalCampaignList = ko.observableArray();
    
    self.campaignListFilter = ko.observable();
    
    self.showCampaignList = ko.computed(function() {
        return navigation.showMain();
    });
    
    self.campaignList = ko.computed(function() {
        var filter = self.campaignListFilter(),
            campaignList;
        
        campaignList = !filter
            ? internalCampaignList()
            : $.grep(internalCampaignList(), function(campaign) { 
                return campaign.name().toLowerCase().indexOf(filter.toLowerCase()) !== -1; 
            });
                
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
        
        self.getCampaignList();
    });
    
    user.isLoggedIn.subscribe(function(isLoggedIn) {
        if(!isLoggedIn)
            return;
        
        self.getCampaignList();
    });
    
    self.getCampaignList = function() {
        var params = { action: 'GetCampaignList' };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
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
};