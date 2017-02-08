var CreateCampaignFactionEntryViewModel = function(campaignObs, campaignEntry) {
    var self = this,
        campaignFactionEntry = new CampaignFactionEntry();
    
    self.selectedFaction = campaignFactionEntry.faction;
    self.selectedUser = campaignFactionEntry.user;
    self.victoryPoints = campaignFactionEntry.victoryPoints;
    
    self.availableFactions = ko.computed(function() {
        var campaignObj = campaignObs();
        return campaignObj ? campaignObj.factions() : null;
    });
    
    self.addFaction = function() {
        campaignEntry.factionEntries.push($.extend({}, campaignFactionEntry));
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