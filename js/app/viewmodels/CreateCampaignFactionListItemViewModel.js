/*exported CreateCampaignFactionListItemViewModel */
/*globals ko, ColourHelper */
var CreateCampaignFactionListItemViewModel = function(entryCampaign, faction) {
	var self = this;
	
	self.name = faction.name;
    self.colour = ko.computed(function() {
        return ColourHelper.rgbToHex(faction.colour());
    });
    
    self.removeFaction = function() {
        var factions = entryCampaign.factions(),
            factionIndex = factions.indexOf(faction);
            
        if(factionIndex !== -1)
            entryCampaign.factions.splice(factionIndex, 1);
    };
};