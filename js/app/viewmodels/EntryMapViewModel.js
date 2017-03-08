/*exported EntryMapViewModel */
/*globals ko, Translation, MapLegendViewModel, MapHelper */
var EntryMapViewModel = function(navigation, currentCampaign) {
    var self = this,
        adjacentTerritories = ko.observableArray(),
        mapHelper = new MapHelper('EntryMapCanvas');    // Putting DOM stuff into ViewModels is bad, but I think this is less bad than several alternatives.

    self.mapImageUrl = ko.observable();
    self.drawingTerritory = ko.observable();
    self.showLoadingImage = ko.observable(true);
    self.attackingFaction = ko.observable();

    self.showMap = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return false;
        
        return campaign.isMapCampaign() && navigation.showCreateEntry();
    });
    
    self.selectedTerritory = ko.observable().extend({ 
        required: { message: Translation.getString('territoryRequiredValidator'), onlyIf: self.showMap } 
    });
        
    self.mapLegendFactions = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return null;

        return $.map(campaign.factions(), function(faction) {
            return new MapLegendViewModel(faction);
        });
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
            }
        });
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
        if(self.selectedTerritory())
            self.selectedTerritory(null);

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
    };

    self.storeImage = function() {
        mapHelper.storeImage();
        self.showLoadingImage(false);
    };
    
    navigation.showCreateEntry.subscribe(function(showCreateEntry) {
        if(!showCreateEntry)
            return;
        
        self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + currentCampaign().id());
    });
};