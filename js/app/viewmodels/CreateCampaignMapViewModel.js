/*exported CreateCampaignMapViewModel */
/*globals ko, MapHelper, MapLegendViewModel */
var CreateCampaignMapViewModel = function(navigation, entryCampaign) {
    var self = this,
        mapHelper = new MapHelper('CampaignMapCanvas'),
        draggingFactionId = ko.observable(),
        territoryPolygons = ko.observable();
        
    self.factionTerritories = ko.observable({}).extend({
        everyFactionRequiresATerritory: { message: Translation.getString('everyFactionMustHaveATerritory'), params: entryCampaign.factions }
    });
    
    self.mapImageUrl = ko.observable();
    self.highlightedTerritory = ko.observable();
    self.showCreateCampaignMapEntry = ko.observable(false);
    self.showLoadingImage = ko.observable(true);
    self.selectedTerritory = ko.observable();
    
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
    
    self.hasSelectedTerritory = ko.computed(function() {
        var selected = self.selectedTerritory();
        return selected !== null && selected !== undefined;
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
        self.factionTerritories({});
        self.factionTerritories.isModified(false);
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
            
        self.selectedTerritory(null);
            
        mapHelper.restoreOriginalImageForPolygon(droppingTerritory);
        mapHelper.drawTerritory(droppingTerritory, self.draggingFactionColour);
        mapHelper.storeImage();
        giveTerritoryToFaction(droppingTerritory.Id, factionId);
    };
    
    self.selectTerritory = function(createCampaignMapViewModel, event) {
        var clickedTerritory = mapHelper.findPolygonUnderMouseEvent(territoryPolygons(), event);
        
        if(!self.factionTerritories()[clickedTerritory.Id])
            return;
        
        mapHelper.restoreImage();
        if(self.selectedTerritory() === clickedTerritory) {
            self.selectedTerritory(null);
        } else {
            self.selectedTerritory(clickedTerritory);
        }
    };
    
    self.saveMap = function() {
        if(!self.factionTerritories.isValid()) {
            self.factionTerritories.isModified(true);
            return;
        }
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            datatype: 'JSON',
            data: {
                action: 'SaveFactionTerritories',
                factionTerritories: self.factionTerritories()
            },
            success: function() {
                navigation.showMain(true);
            }
        });
    };
    
    function giveTerritoryToFaction(territoryId, factionId) {
        var territories = self.factionTerritories();
        territories[territoryId] = factionId;
        self.factionTerritories(territories);
    }
    
    self.deleteSelectedTerritory = function() {
        var selected = self.selectedTerritory();
        giveTerritoryToFaction(selected.Id, undefined);
        mapHelper.restoreOriginalImageForPolygon(selected);
        mapHelper.storeImage();
    };

    entryCampaign.id.subscribe(function(newCampaignId) {
        if(entryCampaign.isMapCampaign())
            self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + newCampaignId);
    });
};