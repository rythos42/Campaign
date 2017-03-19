/*exported EntryMapViewModel */
/*globals ko, Translation, MapLegendViewModel, MapHelper */
var EntryMapViewModel = function(navigation, currentCampaign, currentEntry) {
    var self = this,
        adjacentTerritories = ko.observableArray(),
        mapHelper = new MapHelper('EntryMapCanvas'),    // Putting DOM stuff into ViewModels is bad, but I think this is less bad than several alternatives.
        loadingMapDeferred,
        loadingTerritoriesDeferred;

    self.mapImageUrl = ko.observable();
    self.drawingTerritory = ko.observable();
    self.showLoadingImage = ko.observable(true);
    self.attackingFaction = currentEntry.attackingFaction;

    self.showMap = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return false;
        
        return campaign.isMapCampaign() && navigation.showCreateEntry();
    });
    
    self.selectedTerritory = ko.observable().extend({ 
        required: { message: Translation.getString('territoryRequiredValidator'), onlyIf: self.showMap } 
    });
            
    self.availableFactions = ko.computed(function() {
        var campaignObj = currentCampaign();
        return campaignObj ? campaignObj.factions() : null;
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
                currentEntry.updateTerritoryBeingAttacked(newAdjacentTerritories);
                
                loadingTerritoriesDeferred.resolve();
            }
        });
    }
        
    function shouldDrawTerritoryBeingAttacked() {
        return currentEntry.territoryBeingAttacked() && !self.selectedTerritory();
    }
    
    self.attackingFaction.subscribe(function(attackingFaction) {
        if(!attackingFaction) {
            adjacentTerritories([]);
            return;
        }
        
        getAdjacentTerritoriesForFaction(attackingFaction.id());
    });
    
    self.drawTerritory = function(viewModel, event) {
        if(self.selectedTerritory())
            return;
        
        mapHelper.restoreImage();
        self.drawingTerritory(mapHelper.findPolygonUnderMouseEvent(adjacentTerritories(), event));
    };
    
    self.selectTerritory = function() {
        // if there is a territory selected, unselect it
        if(self.selectedTerritory()) {
            self.selectedTerritory(null);
            mapHelper.restoreImage();
        }

        // if we're hovering over a territory, select it
        if(self.drawingTerritory()) {
            self.selectedTerritory(self.drawingTerritory());
            self.drawingTerritory(null);
        }
    };
    
    self.clearMap = function() {
        self.mapImageUrl(null);
        self.drawingTerritory(null);
        self.selectedTerritory(null);
        self.selectedTerritory.isModified(false);
        adjacentTerritories(null);
        mapHelper.clearImageData();
        self.showLoadingImage(true);
        self.attackingFaction(null);
    };
    
    self.storeImage = function() {
        mapHelper.storeImage();
        self.showLoadingImage(false);
        
        loadingMapDeferred.resolve();
    };
    
    self.setFactionColourInList = function(option, item) {
        if(item)
            ko.applyBindingsToNode(option, {domColour: item.colour}, item);
    };

    navigation.showCreateEntry.subscribe(function(showCreateEntry) {
        if(!showCreateEntry)
            return;
        
        loadingMapDeferred = $.Deferred();
        loadingTerritoriesDeferred = $.Deferred();
        $.when(loadingMapDeferred, loadingTerritoriesDeferred).then(function() {
            // Wait for both the map and the territories to be loaded before drawing any highlighted territory
            if(shouldDrawTerritoryBeingAttacked()) {
                self.drawingTerritory(currentEntry.territoryBeingAttacked());
                self.selectTerritory();
            }
        });

        self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + currentCampaign().id());
    });
    
    self.selectedTerritory.subscribe(function(newSelectedTerritory) {
        currentEntry.territoryBeingAttacked(newSelectedTerritory);
        currentEntry.territoryBeingAttackedIdOnMap(newSelectedTerritory ? newSelectedTerritory.IdOnMap : null);
    });
    
    self.attackingFaction.subscribe(function() {
        self.selectedTerritory(null);
        mapHelper.restoreImage();
    });
};