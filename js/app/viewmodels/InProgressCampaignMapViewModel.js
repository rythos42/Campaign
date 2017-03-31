/*exported InProgressCampaignMapViewModel */
/*globals ko, MapHelper */
var InProgressCampaignMapViewModel = function(navigation, currentCampaign, userCampaignData) {
    var self = this,
        adjacentTerritories = ko.observableArray(),
        mapHelper = new MapHelper('EntryMapCanvas');    // Putting DOM stuff into ViewModels is bad, but I think this is less bad than several alternatives.

    self.mapImageUrl = ko.observable();
    self.drawingTerritory = ko.observable();
    self.showLoadingImage = ko.observable(true);

    self.showMap = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return false;
        
        return campaign.isMapCampaign();
    });
    
    function getAdjacentTerritoriesForFaction(factionId) {
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            dataType: 'JSON',
            data: {
                action: 'GetAdjacentTerritoriesForFaction',
                factionId: factionId
            },
            success: function(newAdjacentTerritories) {
                adjacentTerritories(newAdjacentTerritories);
            }
        });
    }
               
    self.drawTerritory = function(viewModel, event) {
        mapHelper.restoreImage();
        self.drawingTerritory(mapHelper.findPolygonUnderMouseEvent(adjacentTerritories(), event));
    };
    
    self.startChallenge = function() {
        navigation.parameters(self.drawingTerritory());
        navigation.showCreateEntry(true);
    };
    
    self.clearMap = function() {
        self.mapImageUrl(null);
        self.drawingTerritory(null);
        adjacentTerritories(null);
        mapHelper.clearImageData();
        self.showLoadingImage(true);
    };
    
    self.storeImage = function() {
        mapHelper.storeImage();
        self.showLoadingImage(false);
    };
    
    currentCampaign.subscribe(function(campaign) {
        if(!campaign)
            return;
        
        self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + campaign.id());
    });
    
    userCampaignData.subscribe(function(campaignData) {
        if(!campaignData)
            return;
        
        getAdjacentTerritoriesForFaction(campaignData.FactionId);
    });
};