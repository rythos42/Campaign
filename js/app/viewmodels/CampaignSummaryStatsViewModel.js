/*exported CampaignSummaryStatsViewModel */
/*globals ko, DateTimeFormatter, GiveTerritoryBonusToUserDialogViewModel, DialogResult, UserManager, FactionEntrySummaryViewModel */
var CampaignSummaryStatsViewModel = function(user, currentCampaign, entryList, userCampaignData) {
    var self = this;
    
    self.giveTerritoryBonusToUserDialogViewModel = new GiveTerritoryBonusToUserDialogViewModel(user, currentCampaign);

    self.hasJoinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });

    self.isMapCampaign = ko.computed(function() {
        var campaign = currentCampaign();
        return campaign ? campaign.isMapCampaign() : false;
    });
    
    self.phaseStartDate = ko.computed(function() {
        var userData = userCampaignData();
        if(!userData || !userData.PhaseStartDate)
            return '--';
        
        return DateTimeFormatter.formatDate(userData.PhaseStartDate);
    });
    
        self.availableTerritoryBonus = ko.computed(function() {
        var userData = userCampaignData();
        return userData ? userData.TerritoryBonus : 0;
    });

    self.mandatoryAttacks = ko.computed(function() {
        var userData = userCampaignData();
        if(!userData)
            return '';
        
        var attacks = userData.Attacks,
            mandatoryAttacks = userData.MandatoryAttacks;
            
        return attacks > mandatoryAttacks 
            ? (mandatoryAttacks + '/' + mandatoryAttacks) 
            : (attacks + '/' + mandatoryAttacks);
    });
    
    self.optionalAttacks = ko.computed(function() {
        var userData = userCampaignData();
        if(!userData)
            return '';
                
        var attacks = userData.Attacks,
            mandatoryAttacks = userData.MandatoryAttacks,
            optionalAttacks = userData.OptionalAttacks;
            
        return (attacks > mandatoryAttacks)
            ? ((attacks - mandatoryAttacks) + '/' + optionalAttacks)
            : '0/' + optionalAttacks;
    });
                    
    self.factionEntrySummaries = ko.computed(function() {
        var factionEntrySummaries = {};
        $.each(entryList(), function(i, entry) {
            $.each(entry.factionEntries(), function(j, factionEntry) {
                var factionId = factionEntry.faction().id();
                if(!factionEntrySummaries[factionId])
                    factionEntrySummaries[factionId] = new FactionEntrySummaryViewModel(factionEntry);
                
                var factionSummary = factionEntrySummaries[factionId];
                factionSummary.addVictoryPoints(factionEntry.victoryPoints());
            });
        });
        return $.map(factionEntrySummaries, function(factionEntrySummary) {
            return factionEntrySummary;
        });
    });
        
    self.showGiveTerritoryBonusDialog = function() {
        self.giveTerritoryBonusToUserDialogViewModel.openDialog();
    };
    
    var setUserDataForCampaign = function(userDataForCampaign) {
        userCampaignData(userDataForCampaign);
        user.setFromCampaignData(userDataForCampaign);
        currentCampaign().mandatoryAttacks(userDataForCampaign.MandatoryAttacks);
        currentCampaign().optionalAttacks(userDataForCampaign.OptionalAttacks);
    };
        
    self.giveTerritoryBonusToUserDialogViewModel.dialogResult.subscribe(function(result) {
        if(result === DialogResult.Saved) {
            $.ajax({
                url: 'src/webservices/UserService.php',
                data: {
                    action: 'GiveTerritoryBonusInCampaignTo',
                    userId: self.giveTerritoryBonusToUserDialogViewModel.selectedUser().id(),
                    campaignId: currentCampaign().id(),
                    amount: 1,
                    takeFromMe: true
                }
            }).then(function() {
                UserManager.refreshUserDataForCampaign(currentCampaign().id()).then(function(userDataForCampaign) {
                    setUserDataForCampaign(userDataForCampaign);
                });
            });
        }
    });
};