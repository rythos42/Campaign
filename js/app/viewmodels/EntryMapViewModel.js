/*exported EntryMapViewModel */
/*globals ko, Translation, MapLegendViewModel, MapHelper */
var EntryMapViewModel = function(navigation, currentCampaign, currentEntry) {
    var self = this,
        adjacentTerritories = ko.observableArray(),
        mapHelper = new MapHelper('EntryMapCanvas');    // Putting DOM stuff into ViewModels is bad, but I think this is less bad than several alternatives.

    self.mapImageUrl = ko.observable();
    self.drawingTerritory = ko.observable();
    self.selectedTerritory = ko.observable().extend({ required: { message: Translation.getString('territoryRequiredValidator') } });
        
    self.showMap = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return false;
        
        return campaign.isMapCampaign() && navigation.showCampaignEntry();
    });
    
    self.factions = ko.computed(function() {
        var campaign = currentCampaign();
        if(!campaign)
            return null;

        return $.map(campaign.factions(), function(faction) {
            return new MapLegendViewModel(faction);
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
    
    currentEntry.attackingFaction.subscribe(function(attackingFaction) {
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
        mapHelper.clearImageData();
    };

    self.storeImage = function() {
        mapHelper.storeImage();
    };
    
    currentCampaign.subscribe(function(newCampaign) {
        self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + newCampaign.id());
    });
};