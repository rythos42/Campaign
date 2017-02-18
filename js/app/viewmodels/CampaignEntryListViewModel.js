/*exported CampaignEntryListViewModel */
/*globals ko, CampaignEntryListItemViewModel, CampaignEntry, FactionEntrySummaryViewModel */
var CampaignEntryListViewModel = function(navigation, currentCampaign) {
    var self = this,
        internalCampaignEntryList = ko.observableArray();

    self.showCampaignEntryList = ko.computed(function() {
        return navigation.showCampaignEntry() && self.campaignEntries().length > 0;
    });        
        
    self.campaignEntries = ko.computed(function() {
        return $.map(internalCampaignEntryList(), function(campaignEntry) {
            return new CampaignEntryListItemViewModel(campaignEntry);
        });
    });
    
    self.factionEntrySummaries = ko.computed(function() {
        var factionEntrySummaries = {};
        $.each(internalCampaignEntryList(), function(i, campaignEntry) {
            $.each(campaignEntry.factionEntries(), function(j, factionEntry) {
                var factionId = factionEntry.faction().id();
                if(!factionEntrySummaries[factionId])
                    factionEntrySummaries[factionId] = new FactionEntrySummaryViewModel(factionEntry);
                
                var factionSummary = factionEntrySummaries[factionId];
                factionSummary.addVictoryPoints(factionEntry.victoryPoints());
            });
        });
        return $.map(factionEntrySummaries, function(factionEntrySummary) {
            return factionEntrySummary;
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