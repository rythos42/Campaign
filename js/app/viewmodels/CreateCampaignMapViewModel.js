/*exported CreateCampaignMapViewModel */
/*globals ko, MapHelper, MapLegendViewModel */
var CreateCampaignMapViewModel = function(navigation, entryCampaign) {
    var self = this,
        mapHelper = new MapHelper('CampaignMapCanvas'),
        draggingFactionId = ko.observable(),
        territoryPolygons = ko.observable(),
        factionTerritories = {};
    
    self.mapImageUrl = ko.observable();
    self.highlightedTerritory = ko.observable();
    
    self.draggingFactionColour = ko.computed(function() {
        var factionId = draggingFactionId(),
            colour;
            
        $.each(entryCampaign.factions(), function(index, faction) {
            if(faction.id() === factionId) {
                colour = faction.colour();
                return false;
            }
            return true;
        });
        
        return colour;
    });

    self.showMap = ko.computed(function() {
        return entryCampaign.isMapCampaign();
    });
    
    self.showSaveMap = ko.computed(function() {
        return territoryPolygons() ? territoryPolygons().length > 0 : false;
    });
    
    self.factions = ko.computed(function() {
        return $.map(entryCampaign.factions(), function(faction) {
            return new MapLegendViewModel(faction);
        });
    });
    
    self.setTerritoryPolygons = function(newTerritoryPolygons) {
        territoryPolygons(newTerritoryPolygons);
    };
    
    self.storeImage = function() {
        mapHelper.storeImage();
    };
    
    self.clearMap = function() {
        self.mapImageUrl(null);
        self.highlightedTerritory(null);
        factionTerritories = {};
        draggingFactionId(null);
        territoryPolygons(null);
        mapHelper.clearImageData();
    };
    
    self.dragFaction = function(mapLegendViewModel) {
        draggingFactionId(mapLegendViewModel.id());
        return true;
    };
    
    self.highlightDraggingTerritory = function(createCampaignMapViewModel, event) {
        mapHelper.restoreImage();
        self.highlightedTerritory(mapHelper.findPolygonUnderMouseEvent(territoryPolygons(), event));
    };
    
    self.placeFactionInTerritory = function(createCampaignMapViewModel, event) {
        mapHelper.storeImage();
        
        var droppingTerritory = mapHelper.findPolygonUnderMouseEvent(territoryPolygons(), event),
            factionId = draggingFactionId();
        
        if(!factionTerritories[factionId])
            factionTerritories[factionId] = [];
        factionTerritories[factionId].push(droppingTerritory.Id);
    };
    
    self.saveMap = function() {
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            datatype: 'JSON',
            data: {
                action: 'SaveFactionTerritories',
                factionTerritories: factionTerritories
            },
            success: function() {
                navigation.showMain(true);
            }
        });
    };

    entryCampaign.id.subscribe(function(newCampaignId) {
        if(entryCampaign.isMapCampaign())
            self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + newCampaignId);
    });
};