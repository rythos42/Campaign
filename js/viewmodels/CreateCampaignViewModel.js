var CreateCampaignViewModel = function(user, campaign) {
    var self = this;
    
    self.name = campaign.name;
    self.factionNameEntry = ko.observable('');
    
    self.isLoggedIn = ko.computed(function() {
        return user.isLoggedIn();
    });
            
    self.numberOfFactions = ko.computed(function() {
        return campaign.factions().length;
    });

    self.factions = ko.computed(function() {
        return $.map(campaign.factions(), function(faction) {
            return new CampaignFactionListItemViewModel(faction);
        });
    });
    
    self.saveCampaign = function() {
        var params = {
            action: 'SaveCampaign',
            name: campaign.name(),
            factions: ko.toJSON(campaign.factions)
        };
        
        $.ajax({
            url: '/src/webservices/CampaignService.php',
            method: 'POST',
            data: params
        });
    };
    
    self.addFaction = function() {
        var faction = new Faction(self.factionNameEntry());
        campaign.factions.push(faction);
    };
}