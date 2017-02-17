/*exported CreateCampaignViewModel */
/*globals ko, CampaignFactionListItemViewModel, Faction, Campaign */
var CreateCampaignViewModel = function(navigation) {
    var self = this,
        entryCampaign = new Campaign();
        
    self.name = entryCampaign.name.extend({
        required: { message: Translation.getString('campaignNameRequiredValidation') }
    });
    
    self.factionNameEntry = ko.observable('').extend({
        required: { message: Translation.getString('factionNameRequiredValidation') }
    });
    
    self.campaignNameHasFocus = ko.observable(false);
    
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
    }).extend({
        minLength: { params: 1, message: Translation.getString('minimumOneFactionRequiredValidator')  }
    });
    
    self.hasFactions = ko.computed(function() {
        return self.factions().length > 0;
    });
    
    var validatedEntry = ko.validatedObservable([
        self.name,
        self.factions
    ]);
    
    self.saveCampaign = function() {
        if(!validatedEntry.isValid()) {
            validatedEntry.errors.showAllMessages();
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
    };
    
    navigation.showCreateCampaign.subscribe(function() {
        self.name('');
        self.name.isModified(false);
        self.factionNameEntry('');
        self.factionNameEntry.isModified(false);
        entryCampaign.factions.removeAll();
        self.factions.isModified(false);
        
        self.campaignNameHasFocus(true);
    });
};