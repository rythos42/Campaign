/*exported EntryListViewModel */
/*globals ko, EntryListItemViewModel, PlayerListItemViewModel, UserManager, User */
var EntryListViewModel = function(navigation, currentCampaign, entryList, userCampaignData) {
    var self = this,
        internalPlayers = ko.observableArray();
        
    self.onlyEntriesWithoutOpponent = ko.observable(false);

    self.showEntryList = ko.computed(function() {
        return navigation.showInProgressCampaign() && self.entries().length > 0;
    });        
        
    self.entries = ko.computed(function() {
        function makeList(list) {
            return $.map(list, function(entry) {
                return new EntryListItemViewModel(entry, navigation, currentCampaign, userCampaignData);
            });
        }
        
        if(self.onlyEntriesWithoutOpponent())
            return makeList($.grep(entryList(), function(entry) { return entry.factionEntries().length < 2; }));
        
        return makeList(entryList());
    });
    
    self.players = ko.computed(function() {
        return $.map(internalPlayers(), function(user) {
            return new PlayerListItemViewModel(user);
        });
    });
    
    currentCampaign.subscribe(function(campaign) {
        UserManager.getUsersForCampaign(campaign.id()).done(function(results) {
            internalPlayers($.map(results, function(serverUser) {
                return new User(serverUser.Id, serverUser.Username, serverUser.TerritoryBonus, serverUser.Attacks);
            }));
        });
    });
};