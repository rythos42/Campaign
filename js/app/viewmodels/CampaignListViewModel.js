/*exported CampaignListViewModel */
/*globals ko, CampaignListItemViewModel, Campaign */
var CampaignListViewModel = function(user, navigation) {
    var self = this,
        internalCampaignList = ko.observableArray();
    
    self.campaignListFilter = ko.observable();
    
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
    
    self.joinedCampaigns = ko.computed(function() {
        return $.map($.grep(internalCampaignList(), 
            function(campaign) {
                return campaign.currentUserJoinedCampaign();
            }),
            function(campaign) {
                return new CampaignListItemViewModel(campaign, navigation);
            });
    });
    
    self.noJoinedCampaigns = ko.computed(function() {
        return self.joinedCampaigns().length === 0;
    });
    
    self.hasCampaigns = ko.computed(function() {
        return self.campaignList().length > 0;
    });
    
    self.showJoinedCampaignsButton = ko.computed(function() {
        return user.isLoggedIn();
    });
    
    self.addToJoinedList = function(joinedCampaign) {
        $.each(internalCampaignList(), function(index, campaign) {
            if(joinedCampaign.id() === campaign.id()) {
                campaign.currentUserJoinedCampaign(true);
                return false;
            }
            return true;
        });
    };
        
    self.getCampaignList = function() {
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'GET',
            data: { action: 'GetCampaignList' },
            dataType: 'JSON',
            success: function(serverCampaignList) {
                internalCampaignList($.map(serverCampaignList, function(serverCampaign) {
                    return new Campaign(serverCampaign);
                }));
            }
        });
    };
    
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
};