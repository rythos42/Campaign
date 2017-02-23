/*exported CreateEntryViewModel */
/*globals ko, FactionEntryListItemViewModel, CampaignEntry, CampaignFactionEntry, User, Translation */
var CreateEntryViewModel = function(navigation, currentCampaign) {
    var self = this,
        currentCampaignEntry = new CampaignEntry(),
        campaignFactionEntry = new CampaignFactionEntry(),
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
        
    self.showCampaignEntry = ko.computed(function() {
        return navigation.showCampaignEntry();
    });
    
    self.factionEntries = ko.computed(function() {
        return $.map(currentCampaignEntry.factionEntries(), function(factionEntry) {
            return new FactionEntryListItemViewModel(currentCampaignEntry, factionEntry);
        });
    }).extend({
        minLength: { params: 1, message: Translation.getString('minimumOneFactionValidation') }
    });
    
    self.hasFactionEntries = ko.computed(function() {
        return self.factionEntries().length > 0;
    });
    
    self.availableFactions = ko.computed(function() {
        var campaignObj = currentCampaign();
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
        
        var newFactionEntry = campaignFactionEntry.clone();
        if(!currentCampaignEntry.usersFaction())
            currentCampaignEntry.usersFaction(campaignFactionEntry.faction());
        
        currentCampaignEntry.factionEntries.push(newFactionEntry);
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
               
    navigation.showCampaignEntry.subscribe(function(show) {
        if(!show)
            return;
        
        currentCampaignEntry.clear();        
        self.clearEntry();
        self.factionSelectionHasFocus(true);
    });
    
    currentCampaign.subscribe(function(newCampaign) {
        currentCampaignEntry.campaignId(newCampaign.id());
    });
    
    factionEntryValidationViewModel = ko.validatedObservable([
        self.selectedFaction,
        self.selectedUser,
        self.victoryPoints
    ]);
};