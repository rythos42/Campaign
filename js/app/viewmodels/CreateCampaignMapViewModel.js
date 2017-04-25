/*exported CreateCampaignMapViewModel */
/*globals ko, MapHelper, Translation, EditTerritoryDialogViewModel, DialogResult */
var CreateCampaignMapViewModel = function(navigation, entryCampaign) {
    var self = this,
        mapHelper = new MapHelper('CampaignMapCanvas'),
        territoryPolygons = ko.observable(),
        territoryTags = ko.observable({});
        
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
        loadIntoTerritoryDialog(clickedTerritory);
        self.editTerritoryDialogViewModel.selectedTerritory(clickedTerritory);
        self.editTerritoryDialogViewModel.openDialog();
    };
    
    function loadIntoTerritoryDialog(clickedTerritory) {
        var territoryId = clickedTerritory.Id,
            owningFactionId = self.factionTerritories()[territoryId],
            tags = territoryTags()[territoryId];
            
        self.editTerritoryDialogViewModel.selectedFaction(owningFactionId ? entryCampaign.getFactionById(owningFactionId) : undefined);
        self.editTerritoryDialogViewModel.tags(tags ? tags : undefined);
    }
    
    self.editTerritoryDialogViewModel.dialogResult.subscribe(function(dialogResult) {
        if(dialogResult === DialogResult.Saved) {
            var selectedTerritory = self.editTerritoryDialogViewModel.selectedTerritory(),
                selectedFaction = self.editTerritoryDialogViewModel.selectedFaction();
                
            mapHelper.restoreOriginalImageForPolygon(selectedTerritory);
            if(selectedFaction)
                mapHelper.drawTerritory(selectedTerritory, selectedFaction.colour);
            saveFromTerritoryDialog(selectedTerritory.Id, selectedFaction);
            mapHelper.storeImage();
        }
    });
    
    function saveFromTerritoryDialog(selectedTerritoryId, selectedFaction) {
        var territories = self.factionTerritories();
        territories[selectedTerritoryId] = selectedFaction ? selectedFaction.id() : undefined;
        self.factionTerritories(territories);
        
        territoryTags()[selectedTerritoryId] = self.editTerritoryDialogViewModel.tags();
    }
    
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
                factionTerritories: self.factionTerritories(),
                territoryTags: territoryTags()
            },
            success: function() {
                navigation.showMain(true);
            }
        });
    };

    entryCampaign.id.subscribe(function(newCampaignId) {
        if(entryCampaign.isMapCampaign())
            self.mapImageUrl(mapHelper.createGetMapServiceCallUrl(newCampaignId, entryCampaign.mapImageWidth(), entryCampaign.mapImageHeight(), entryCampaign.mapImageName()));
    });
};