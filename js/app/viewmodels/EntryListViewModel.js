/*exported EntryListViewModel */
/*globals ko, EntryListItemViewModel, Entry, FactionEntrySummaryViewModel */
var EntryListViewModel = function(navigation, currentCampaign) {
    var self = this,
        internalEntryList = ko.observableArray(),
        currentlyLoadingEntryList = false;

    self.showCampaignEntryList = ko.computed(function() {
        return navigation.showInProgressCampaign() && self.campaignEntries().length > 0;
    });        
        
    self.campaignEntries = ko.computed(function() {
        return $.map(internalEntryList(), function(entry) {
            return new EntryListItemViewModel(entry);
        });
    });
    
    self.factionEntrySummaries = ko.computed(function() {
        var factionEntrySummaries = {};
        $.each(internalEntryList(), function(i, entry) {
            $.each(entry.factionEntries(), function(j, factionEntry) {
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
    
    function getEntryList() {
        var campaign = currentCampaign();
        
        // Don't do it again if we're already doing it.
        if(!campaign || currentlyLoadingEntryList)
            return;
        
        currentlyLoadingEntryList = true;
        var params = { action: 'GetEntryList', campaignId: campaign.id() };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'GET',
            data: params,
            dataType: 'JSON',
            success: function(serverEntryList) {
                internalEntryList($.map(serverEntryList, function(serverEntry) {
                    return new Entry(campaign.id(), serverEntry);
                }));
                currentlyLoadingEntryList = false;
            }
        });
    }
    
    currentCampaign.subscribe(function() {
        // when the campaign is changed, update the entry list
        getEntryList();
    });
    
    navigation.showInProgressCampaign.subscribe(function(show) {
        if(!show) 
            internalEntryList.removeAll();
        else // when we come here after creating an entry, update the entry list
            getEntryList();
    });
};