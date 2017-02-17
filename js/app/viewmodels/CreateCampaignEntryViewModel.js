/*exported CreateCampaignEntryViewModel */
/*globals ko, CampaignFactionEntryListItemViewModel, CampaignEntryListItemViewModel, CampaignEntry, CampaignFactionEntry, User, Translation */
var CreateCampaignEntryViewModel = function(navigation) {
    var self = this,
        campaign = ko.observable(null),
        currentCampaignEntry = new CampaignEntry(),
        campaignFactionEntry = new CampaignFactionEntry(),
        internalCampaignEntryList = ko.observableArray(),
        factionEntryValidationViewModel;
        
    self.factionSelectionHasFocus = ko.observable(false);
    self.selectedFaction = campaignFactionEntry.faction.extend({
        required: { message: Translation.getString('factionEntryRequiredValidation') }
    });
    
    self.selectedUser = campaignFactionEntry.user.extend({
        required: { message: Translation.getString('userEntryRequiredValidation') },
        requireObject: { message: Translation.getString('userEntryInvalidAccountValidation') }
    });
    
    self.victoryPoints = campaignFactionEntry.victoryPoints.extend({
        required: { message: Translation.getString('victoryPointsEntryRequiredValidation') }
    });
        
    self.showCreateCampaignEntry = ko.computed(function() {
        return navigation.showCreateCampaignEntry();
    });
    
    self.factionEntries = ko.computed(function() {
        return $.map(currentCampaignEntry.factionEntries(), function(factionEntry) {
            return new CampaignFactionEntryListItemViewModel(factionEntry);
        });
    }).extend({
        minLength: { params: 1, message: Translation.getString('minimumOneFactionValidation') }
    });
    
    self.campaignEntries = ko.computed(function() {
        return $.map(internalCampaignEntryList(), function(campaignEntry) {
            return new CampaignEntryListItemViewModel(campaignEntry);
        });
    });
    
    self.hasFactionEntries = ko.computed(function() {
        return self.factionEntries().length > 0;
    });
    
    self.availableFactions = ko.computed(function() {
        var campaignObj = campaign();
        return campaignObj ? campaignObj.factions() : null;
    });
    
    var validatedEntry = ko.validatedObservable([
        self.factionEntries
    ]);
    
    self.saveCampaignEntry = function() {
        if(!validatedEntry.isValid()) {
            validatedEntry.errors.showAllMessages();
            return;
        }
        
        var params = {
            action: 'SaveCampaignEntry',
            campaignEntry: ko.toJSON(currentCampaignEntry)
        };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
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
        
        self.factionEntries.isModified(false);
    };
    
    self.getUsers = function(term, responseCallback) {
        $.ajax({
            url: 'src/webservices/UserService.php',
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
                    };
                }));
            }
        });
    };
    
    self.getCampaignEntryList = function() {
        var params = { action: 'GetCampaignEntryList', campaignId: currentCampaignEntry.campaignId() };
        
        $.ajax({
            url: 'src/webservices/CampaignService.php',
            method: 'GET',
            data: params,
            dataType: 'JSON',
            success: function(serverCampaignEntryList) {
                internalCampaignEntryList($.map(serverCampaignEntryList, function(serverCampaignEntry) {
                    return new CampaignEntry(currentCampaignEntry.campaignId(), serverCampaignEntry);
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
        self.getCampaignEntryList();
    });
    
    factionEntryValidationViewModel = ko.validatedObservable([
        self.selectedFaction,
        self.selectedUser,
        self.victoryPoints
    ]);
};