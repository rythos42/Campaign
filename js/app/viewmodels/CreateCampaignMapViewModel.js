/*exported CreateCampaignMapViewModel */
/*globals ko, MapHelper, Translation, EditTerritoryDialogViewModel, DialogResult */
var CreateCampaignMapViewModel = function(navigation, entryCampaign) {
    var self = this,
        mapHelper = new MapHelper('CampaignMapCanvas'),
        territoryPolygons = ko.observable();
        
    self.editTerritoryDialogViewModel = new EditTerritoryDialogViewModel(entryCampaign);
    
    self.factionTerritories = ko.observable({}).extend({
        everyFactionRequiresATerritory: { message: Translation.getString('everyFactionMustHaveATerritory'), params: entryCampaign.factions }
    });
    
    self.mapImageUrl = ko.observable();
    self.showCreateCampaignMapEntry = ko.observable(false);
    self.showLoadingImage = ko.observable(true);
    
    self.showMap = ko.computed(function() {
        return entryCampaign.isMapCampaign() && self.showCreateCampaignMapEntry();
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
        self.factionTerritories({});
        self.factionTerritories.isModified(false);
        territoryPolygons(null);
        mapHelper.clearImageData();
        self.showCreateCampaignMapEntry(false);
        self.showLoadingImage(true);
    };

    self.selectTerritory = function(createCampaignMapViewModel, event) {
        var clickedTerritory = mapHelper.findPolygonUnderMouseEvent(territoryPolygons(), event);
        
        var territories = self.factionTerritories(),
            owningFactionId = territories[clickedTerritory.Id];
        if(owningFactionId) {
            var owningFaction = entryCampaign.getFactionById(owningFactionId);
            self.editTerritoryDialogViewModel.selectedFaction(owningFaction);
        } else {
            self.editTerritoryDialogViewModel.selectedFaction(undefined);
        }           
            
        self.editTerritoryDialogViewModel.selectedTerritory(clickedTerritory);
        self.editTerritoryDialogViewModel.openDialog();
    };
    
    self.editTerritoryDialogViewModel.dialogResult.subscribe(function(dialogResult) {
        if(dialogResult === DialogResult.Saved) {
            var selectedFaction = self.editTerritoryDialogViewModel.selectedFaction(),
                selectedTerritory = self.editTerritoryDialogViewModel.selectedTerritory();
                
            mapHelper.restoreOriginalImageForPolygon(selectedTerritory);
            var territories = self.factionTerritories();
            if(selectedFaction) {
                mapHelper.drawTerritory(selectedTerritory, selectedFaction.colour);
                territories[selectedTerritory.Id] = selectedFaction.id();
            } else {
                territories[selectedTerritory.Id] = undefined;
            }

            self.factionTerritories(territories);
            mapHelper.storeImage();
        }
    });
    
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

    entryCampaign.id.subscribe(function(newCampaignId) {
        if(entryCampaign.isMapCampaign())
            self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + newCampaignId);
    });
};