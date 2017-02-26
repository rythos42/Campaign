/*exported CreateCampaignMapViewModel */
/*globals ko, MapHelper, MapLegendViewModel */
var CreateCampaignMapViewModel = function(navigation, entryCampaign) {
    var self = this,
        mapHelper = new MapHelper('CampaignMapCanvas');
    
    self.mapImageUrl = ko.observable();
    self.showMap = ko.computed(function() {
        return entryCampaign.isMapCampaign();
    });
    
    self.factions = ko.computed(function() {
        return $.map(entryCampaign.factions(), function(faction) {
            return new MapLegendViewModel(faction);
        });
    });
    
    self.storeImage = function() {
        mapHelper.storeImage();
    };
    
    entryCampaign.id.subscribe(function(newCampaignId) {
        if(entryCampaign.isMapCampaign())
            self.mapImageUrl('src/webservices/CampaignService.php?action=GetMap&campaignId=' + newCampaignId);
    });
    
    self.clearMap = function() {
        self.mapImageUrl(null);
        mapHelper.clearImageData();
    };
};