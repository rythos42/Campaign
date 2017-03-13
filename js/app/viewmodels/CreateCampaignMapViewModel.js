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
    self.showCreateCampaignMapEntry = ko.observable(false);
    self.showLoadingImage = ko.observable(true);
    
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
        return entryCampaign.isMapCampaign() && self.showCreateCampaignMapEntry();
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
        self.showLoadingImage(false);
    };
    
    self.clearMap = function() {
        self.mapImageUrl(null);
        self.highlightedTerritory(null);
        factionTerritories = {};
        draggingFactionId(null);
        territoryPolygons(null);
        mapHelper.clearImageData();
        self.showCreateCampaignMapEntry(false);
        self.showLoadingImage(true);
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
        var droppingTerritory = mapHelper.findPolygonUnderMouseEvent(territoryPolygons(), event),
            factionId = draggingFactionId();
            
        mapHelper.restoreOriginalImageForPolygon(droppingTerritory);
        mapHelper.drawTerritory(droppingTerritory, self.draggingFactionColour);
        mapHelper.storeImage();
        factionTerritories[droppingTerritory.Id] = factionId;
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