var CreateCampaignFactionEntryViewModel = function(campaignObs, currentCampaignEntry) {
    var self = this,
        campaignFactionEntry = new CampaignFactionEntry();
    
    self.selectedFaction = campaignFactionEntry.faction;

    self.selectedUser = campaignFactionEntry.user.extend({
        required: { message: 'Who played this faction in this game?' }
    });
    
    self.victoryPoints = campaignFactionEntry.victoryPoints.extend({
        required: { message: 'At least put a 0 if there was no score!' }
    });
    
    self.availableFactions = ko.computed(function() {
        var campaignObj = campaignObs();
        return campaignObj ? campaignObj.factions() : null;
    });
    
    var validatedViewModel = ko.validatedObservable([
        self.selectedUser,
        self.victoryPoints
    ]);
    
    self.addFaction = function() {
        if(!validatedViewModel.isValid()) {
            validatedViewModel.errors.showAllMessages();
            return;
        }
        
        currentCampaignEntry.factionEntries.push(campaignFactionEntry.clone());
    };
    
    self.clearEntry = function() {
        self.selectedFaction(undefined);
        self.selectedUser(undefined);
        self.victoryPoints(undefined);
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
};