/*exported CreateCampaignViewModel */
/*globals ko, CreateFactionListItemViewModel, Faction, Campaign, Translation, ColourHelper, CreateCampaignMapViewModel */
var CreateCampaignViewModel = function(user, navigation) {
    var self = this,
        entryCampaign = new Campaign();
        
    self.createCampaignMapViewModel = new CreateCampaignMapViewModel(navigation, entryCampaign);
        
    self.name = entryCampaign.name.extend({
        required: { message: Translation.getString('campaignNameRequiredValidation') }
    });
    
    self.campaignType = entryCampaign.campaignType;
    
    self.factionNameEntry = ko.observable('').extend({
        required: { message: Translation.getString('factionNameRequiredValidation') }
    });
    
    self.campaignNameHasFocus = ko.observable(false);
    self.factionNameEntryHasFocus = ko.observable(false);
    
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
            return new CreateFactionListItemViewModel(entryCampaign, faction);
        });
    }).extend({
        minLength: { params: 1, message: Translation.getString('minimumOneFactionRequiredValidator')  }
    });
    
    self.hasFactions = ko.computed(function() {
        return self.factions().length > 0;
    });
    
    self.canCreateMapCampaign = ko.computed(function() {
        return user.hasPermission(1);
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
            campaignType: entryCampaign.campaignType(),
            factions: ko.toJSON(entryCampaign.factions)
        };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'POST',
            data: params,
            success: function(insertCampaignReturnData) {
                $.each(entryCampaign.factions(), function(index, faction) {
                    faction.id(parseInt(insertCampaignReturnData[faction.name()], 10));
                });
                entryCampaign.id(parseInt(insertCampaignReturnData.CampaignId, 10));
                self.createCampaignMapViewModel.setTerritoryPolygons(insertCampaignReturnData.TerritoryPolygons);
                
                navigation.showMain(!entryCampaign.isMapCampaign());
            }
        });
    };
    
    self.back = function() {
        navigation.showMain(true);
    };
    
    self.keyPressAddFaction = function(viewModel, event) {
        if(event.keyCode === 13)
            self.addFaction();  
        return true;
    };
    
    self.addFaction = function() {
        if(!self.factionNameEntry.isValid()) {
            self.factionNameEntry.isModified(true);
            return;
        }
        
        var faction = new Faction(self.factionNameEntry(), undefined, ColourHelper.generateNextRandom());
        entryCampaign.factions.push(faction);
        self.factionNameEntry('');
        self.factionNameEntry.isModified(false);
        self.factionNameEntryHasFocus(true);
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
        self.createCampaignMapViewModel.clearMap();
        
        self.campaignNameHasFocus(true);
    });
};