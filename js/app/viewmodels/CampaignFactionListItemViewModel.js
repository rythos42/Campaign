/*exported CampaignFactionListItemViewModel */
var CampaignFactionListItemViewModel = function(entryCampaign, faction) {
	var self = this;
	
	self.name = faction.name;
    
    self.removeFaction = function() {
        var factions = entryCampaign.factions(),
            factionIndex = factions.indexOf(faction);
            
        if(factionIndex !== -1)
            entryCampaign.factions.splice(factionIndex, 1);
    };
};