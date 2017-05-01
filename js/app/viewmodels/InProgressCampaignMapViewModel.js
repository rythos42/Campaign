/*exported InProgressCampaignMapViewModel */
/*globals _, ko, MapHelper, MapLegendViewModel, TerritoryDetailsDialogViewModel, DialogResult, Colour */
var InProgressCampaignMapViewModel = function(navigation, user, currentCampaign, userCampaignData) {
    var self = this,
        serverTerritories,
        reachableTerritories = ko.observableArray(),
        mapHelper = new MapHelper('EntryMapCanvas');    // Putting DOM stuff into ViewModels is bad, but I think this is less bad than several alternatives.

    self.territoryDetailsDialogViewModel = new TerritoryDetailsDialogViewModel(currentCampaign);
        
    self.mapImageUrl = ko.observable();
    self.drawingTerritory = ko.observable(null);
    self.isLoadingMap = ko.observable(false);
    self.attackAnywhere = ko.observable(false);

    self.showMap = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return false;
        
        return campaign.isMapCampaign();
    });
    
    self.currentUserOutOfAttacks = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return false;
        
        return user.attacks() > (campaign.mandatoryAttacks() + campaign.optionalAttacks());
    });
       
    self.currentUserAttackedWithin24Hours = ko.computed(function() {
        var userData = userCampaignData();
        if(!userData)
            return false;
        
        var lastCreatedDate = new Date(userData.LastCreatedEntryDate);
        lastCreatedDate.setDate(lastCreatedDate.getDate() + 1);
                
        return lastCreatedDate > new Date();        
    });
    
    var canCurrentUserAttack = ko.computed(function() {
        return !self.currentUserOutOfAttacks() && !self.currentUserAttackedWithin24Hours();
    });
    
    self.legendFactions = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return;
        
        return $.map(campaign.factions(), function(faction) {
            return new MapLegendViewModel(faction, user);
        });
    });
    
    self.hasAtLeastOneTerritoryBonus = ko.computed(function() {
       return user.territoryBonus() > 0;
    });
    
    function getAdjacentTerritoriesForFaction(factionId) {
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            dataType: 'JSON',
            data: {
                action: 'GetAdjacentTerritoriesForFaction',
                factionId: factionId
            },
            success: function(territories) {
                serverTerritories = territories;
                reachableTerritories(self.attackAnywhere() ? serverTerritories.All : serverTerritories.Adjacent);
                currentCampaign().territories(serverTerritories.All);
            }
        });
    }
               
    self.drawTerritory = function(viewModel, event) {
        mapHelper.restoreImage();
        self.drawingTerritory(mapHelper.findPolygonUnderMouseEvent(currentCampaign().territories(), event));
    };
    
    self.clearTerritory = function() {
        mapHelper.restoreImage();
        self.drawingTerritory(null);
    };
    
    function isDrawingReachable() {
        if(self.drawingTerritory() === null)
            return false;
        
        return _.find(reachableTerritories(), function(territory) {
            return territory.Id === self.drawingTerritory().Id;
        });
    }
    
    self.isReachableColour = ko.computed(function() {
        return isDrawingReachable() ? new Colour(200, 100, 100)  : new Colour(200, 200, 200);
    });
    
    self.openTerritoryDetails = function() {
        if(!self.drawingTerritory())
            return;
        
        self.territoryDetailsDialogViewModel.territory(self.drawingTerritory());
        self.territoryDetailsDialogViewModel.canBeAttacked(isDrawingReachable() && canCurrentUserAttack());
        self.territoryDetailsDialogViewModel.openDialog();
    };
    
    self.startChallenge = function(territory) {
        if(self.currentUserOutOfAttacks())
            return;

        navigation.parameters(currentCampaign().isMapCampaign() ? { territory: territory, attackingAnywhere: self.attackAnywhere() } : {});
        navigation.showCreateEntry(true);
    };
    
    self.clearMap = function() {
        self.mapImageUrl(null);
        self.drawingTerritory(null);
        reachableTerritories(null);
        mapHelper.clearImageData();
    };
    
    self.storeImage = function() {
        mapHelper.storeImage();
        self.isLoadingMap(false);
    };
    
    function loadMapImage() {
        self.isLoadingMap(true);
        var campaign = currentCampaign(),
            url = mapHelper.createGetMapServiceCallUrl(campaign.id(), campaign.mapImageWidth(), campaign.mapImageHeight(), campaign.mapImageName());
        if(self.mapImageUrl() === url)
            self.mapImageUrl.notifySubscribers(url);
        else
            self.mapImageUrl(url);
    }
    
    self.territoryDetailsDialogViewModel.dialogResult.subscribe(function(dialogResult) {
        if(dialogResult === DialogResult.Saved) {
            self.startChallenge(self.territoryDetailsDialogViewModel.territory());
        }
    });

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
    
    self.attackAnywhere.subscribe(function(attackAnywhere) {
        reachableTerritories(attackAnywhere ? serverTerritories.All : serverTerritories.Adjacent);
    });
};