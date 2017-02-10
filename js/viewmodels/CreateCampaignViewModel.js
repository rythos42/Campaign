var CreateCampaignViewModel = function(navigation) {
    var self = this,
		entryCampaign = new Campaign();

    self.name = entryCampaign.name.extend({
        required: { message: 'Your campaign needs a name.' }
    });
    
    self.factionNameEntry = ko.observable('').extend({
        required: { message: 'Each faction in your campaign needs a name.' }
    });
    
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
        if(!self.name.isValid()) {
            self.name.isModified(true);
            return;
        }
        
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
                navigation.parameters(entryCampaign.clone());
                navigation.showMain(true);
            }
        });
    };
    
    self.back = function() {
        navigation.showMain(true);
    };
    
    self.addFaction = function() {
        if(!self.factionNameEntry.isValid()) {
            self.factionNameEntry.isModified(true);
            return;
        }
        
        var faction = new Faction(self.factionNameEntry());
        entryCampaign.factions.push(faction);
    };
    
    self.requestCreateCampaign = function() {
        navigation.showCreateCampaign(true);
    }
    
    navigation.showCreateCampaign.subscribe(function(show) {
        self.name('');
        self.factionNameEntry('');
        entryCampaign.factions.removeAll();
    });
}