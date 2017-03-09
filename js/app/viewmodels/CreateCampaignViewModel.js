/*exported CreateCampaignViewModel */
/*globals ko, CreateFactionListItemViewModel, Faction, Campaign, Translation, ColourHelper, CreateCampaignMapViewModel */
var CreateCampaignViewModel = function(user, navigation) {
    var self = this,
        entryCampaign = new Campaign(),
        showCampaignEntry = ko.observable(true);
        
    self.createCampaignMapViewModel = new CreateCampaignMapViewModel(navigation, entryCampaign);
        
    self.name = entryCampaign.name.extend({
        required: { message: Translation.getString('campaignNameRequiredValidation') },
        maxLength: { params: 45, message: Translation.getString('campaignNameMaxLengthValidation') }
    });
    
    self.campaignType = ko.computed({
        read: function() { return entryCampaign.campaignType(); },
        write: function(newCampaignType) {
            entryCampaign.campaignType(parseInt(newCampaignType, 10));
        }
    });
    
    self.factions = ko.computed(function() {
        return $.map(entryCampaign.factions(), function(faction) {
            return new CreateFactionListItemViewModel(entryCampaign, faction);
        });
    }).extend({
        minLength: { params: 1, message: Translation.getString('minimumOneFactionRequiredValidator')  }
    });
    
    self.factionNameEntry = ko.observable('').extend({
        required: { message: Translation.getString('factionNameRequiredValidation') },
        uniqueIn: { params: { array: self.factions, arrayObjectProperty: 'name'}, message: Translation.getString('uniqueFactionNameValidator') }
    });
    
    self.campaignNameHasFocus = ko.observable(false);
    self.factionNameEntryHasFocus = ko.observable(false);
    
    self.showCreateCampaign = ko.computed(function() {
        return navigation.showCreateCampaign();
    });
    
    self.showCreateCampaignEntry = ko.computed(function() {
        return navigation.showCreateCampaign() && showCampaignEntry();
    });
    
    self.showCreateCampaignButton = ko.computed(function() {
        return user.isLoggedIn() && !navigation.showCreateCampaign();
    });
         
    self.numberOfFactions = ko.computed(function() {
        return entryCampaign.factions().length;
    });
    
    self.hasFactions = ko.computed(function() {
        return self.factions().length > 0;
    });
    
    self.canCreateMapCampaign = ko.computed(function() {
        return user.hasPermission(1);
    });
        
    self.saveCampaignButtonText = ko.computed(function() {
        if(entryCampaign.isMapCampaign()) {
            return Translation.getString('generateMap');
        } else {
            return Translation.getString('save');
        }
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
                self.createCampaignMapViewModel.showCreateCampaignMapEntry(entryCampaign.isMapCampaign());

                $.each(entryCampaign.factions(), function(index, faction) {
                    faction.id(parseInt(insertCampaignReturnData.Factions[faction.name()], 10));
                });
                entryCampaign.id(parseInt(insertCampaignReturnData.CampaignId, 10));
                self.createCampaignMapViewModel.setTerritoryPolygons(insertCampaignReturnData.TerritoryPolygons);
                
                navigation.showMain(!entryCampaign.isMapCampaign());
                showCampaignEntry(!entryCampaign.isMapCampaign());
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
        self.createCampaignMapViewModel.clearMap();
        entryCampaign.factions.removeAll();
        self.factions.isModified(false);
        showCampaignEntry(true); 
        
        self.campaignNameHasFocus(true);
    });
};