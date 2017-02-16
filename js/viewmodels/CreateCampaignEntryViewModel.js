var CreateCampaignEntryViewModel = function(navigation) {
    var self = this,
        campaign = ko.observable(null),
        currentCampaignEntry = new CampaignEntry(),
        campaignFactionEntry = new CampaignFactionEntry();
        
    self.factionSelectionHasFocus = ko.observable(false);
    self.selectedFaction = campaignFactionEntry.faction.extend({
        required: { message: 'Who were they playing for?' }
    });
    
    self.selectedUser = campaignFactionEntry.user.extend({
        required: { message: 'Who played this faction in this game?' },
        requireObject: { message: 'That person does\'t have an account here.' }
    });
    
    self.victoryPoints = campaignFactionEntry.victoryPoints.extend({
        required: { message: 'At least put a 0 if there was no score!' }
    });
        
    self.showCreateCampaignEntry = ko.computed(function() {
        return navigation.showCreateCampaignEntry();
    });
    
    self.factionEntries = ko.computed(function() {
        return $.map(currentCampaignEntry.factionEntries(), function(factionEntry) {
            return new CampaignFactionEntryListItemViewModel(factionEntry);
        });
    });
    
    self.hasFactionEntries = ko.computed(function() {
        return self.factionEntries().length > 0;
    });
    
    self.availableFactions = ko.computed(function() {
        var campaignObj = campaign();
        return campaignObj ? campaignObj.factions() : null;
    });
    
    self.saveCampaignEntry = function() {
        var params = {
            action: 'SaveCampaignEntry',
            campaignEntry: ko.toJSON(currentCampaignEntry)
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
        if(!factionEntryValidationViewModel.isValid()) {
            factionEntryValidationViewModel.errors.showAllMessages();
            return;
        }
        
        currentCampaignEntry.factionEntries.push(campaignFactionEntry.clone());
        self.clearEntry();
    };
    
    self.clearEntry = function() {
        self.selectedFaction(undefined);
        self.selectedFaction.isModified(false);
        self.selectedUser(undefined);
        self.selectedUser.isModified(false);
        self.victoryPoints(undefined);
        self.victoryPoints.isModified(false);
    };
    
    self.getUsers = function(term, responseCallback) {
        $.ajax({
            url: '/src/webservices/UserService.php',
            dataType: 'JSON',
            data: {
                action: 'GetUsersByFilter',
                term: term
            },
            success: function(results) {
                responseCallback($.map(results, function(serverUser) {
                    return {
                        label: serverUser.Username,
                        object: new User(serverUser.Id, serverUser.Username)
                    }
                }));
            }
        });
    };
            
    navigation.showCreateCampaignEntry.subscribe(function(show) {
        if(!show)
            return;
        
        currentCampaignEntry.clear();
        self.clearEntry();

        var newCampaign = navigation.parameters();
        navigation.parameters(null);
        campaign(newCampaign);
        currentCampaignEntry.campaignId(newCampaign.id());
        
        self.factionSelectionHasFocus(true);
    });
    
    var factionEntryValidationViewModel = ko.validatedObservable([
        self.selectedFaction,
        self.selectedUser,
        self.victoryPoints
    ]);
};