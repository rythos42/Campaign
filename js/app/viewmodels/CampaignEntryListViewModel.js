var CampaignEntryListViewModel = function(navigation, currentCampaign) {
    var self = this,
        internalCampaignEntryList = ko.observableArray();

    self.showCampaignEntry = ko.computed(function() {
        return navigation.showCampaignEntry();
    });        
        
    self.campaignEntries = ko.computed(function() {
        return $.map(internalCampaignEntryList(), function(campaignEntry) {
            return new CampaignEntryListItemViewModel(campaignEntry);
        });
    });
    
    function getCampaignEntryList() {
        var params = { action: 'GetCampaignEntryList', campaignId: currentCampaign().id() };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'GET',
            data: params,
            dataType: 'JSON',
            success: function(serverCampaignEntryList) {
                internalCampaignEntryList($.map(serverCampaignEntryList, function(serverCampaignEntry) {
                    return new CampaignEntry(currentCampaign().id(), serverCampaignEntry);
                }));
            }
        });
    }
    
    currentCampaign.subscribe(function() {
        getCampaignEntryList();
    });
};