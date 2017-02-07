var CreateCampaignViewModel = function(navigation) {
    var self = this,
		entryCampaign = new Campaign();

    self.name = entryCampaign.name;
    self.factionNameEntry = ko.observable('');
    
    self.showCreateCampaign = ko.computed(function() {
        return navigation.showCreateCampaign();
    });
    
    self.showCreateCampaignButton = ko.computed(function() {
        return navigation.showMain();
    });
         
    self.numberOfFactions = ko.computed(function() {
        return entryCampaign.factions().length;
    });

    self.factions = ko.computed(function() {
        return $.map(entryCampaign.factions(), function(faction) {
            return new CampaignFactionListItemViewModel(faction);
        });
    });
    
    self.saveCampaign = function() {
        var params = {
            action: 'SaveCampaign',
            name: entryCampaign.name(),
            factions: ko.toJSON(entryCampaign.factions)
        };
        
        $.ajax({
            url: '/src/webservices/CampaignService.php',
            method: 'POST',
            data: params,
            success: function() {
                navigation.showMain(true);
            }
        });
    };
    
    self.addFaction = function() {
        var faction = new Faction(self.factionNameEntry());
        entryCampaign.factions.push(faction);
    };
    
    self.requestCreateCampaign = function() {
        navigation.showCreateCampaign(true);
    }
}