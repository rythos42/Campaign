/*exported InProgressCampaignMapViewModel */
/*globals ko, MapHelper, MapLegendViewModel */
var InProgressCampaignMapViewModel = function(navigation, user, currentCampaign, userCampaignData) {
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
        
    self.legendFactions = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return;
        
        return $.map(campaign.factions(), function(faction) {
            return new MapLegendViewModel(faction, user);
        });
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
        if(currentCampaign().isMapCampaign()) {
            if(!self.drawingTerritory())
                return;
            navigation.parameters(self.drawingTerritory());
        } else {
            navigation.parameters({});
        }
        
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
    
    function loadMapImage() {
        var url = 'src/webservices/CampaignService.php?action=GetMap&campaignId=' + currentCampaign().id();
        if(self.mapImageUrl() === url)
            self.mapImageUrl.notifySubscribers(url);
        else
            self.mapImageUrl(url);
    }

    navigation.showInProgressCampaign.subscribe(function(showInProgressCampaign) {
        if(!showInProgressCampaign || !currentCampaign())
            return;
        
        loadMapImage(); // load when we show InProgressCampaign, but only if there is a campaign set.
    });
    
    currentCampaign.subscribe(function(campaign) {
        if(!campaign)
            return;
        
        loadMapImage(); // load when we set the current campaign
    });
    
    userCampaignData.subscribe(function(campaignData) {
        if(!campaignData)
            return;
        
        getAdjacentTerritoriesForFaction(campaignData.FactionId);
    });
};