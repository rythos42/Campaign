/*exported EntryListViewModel */
/*globals ko, EntryListItemViewModel */
var EntryListViewModel = function(navigation, currentCampaign, entryList, userCampaignData) {
    var self = this;
    
    var FilterType = {
        All: 'All',
        Unfinished: 'Unfinished',
        Finished: 'Finished'
    };
        
    self.entryFilter = ko.observable();
    self.justThisPhaseFilter = ko.observable(false);
    
    self.hasJoinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });
    
    function makeList(list) {
        return $.map(list, function(entry) {
            return new EntryListItemViewModel(entry, navigation, currentCampaign, userCampaignData);
        });
    }
    
    function getFinishTypeFilterFunction() {
        switch(self.entryFilter()) {
            case FilterType.Unfinished:
                return function(entry) { return entry.finishDate() === undefined || entry.finishDate() === null; };
            case FilterType.Finished:
                return function(entry) { return entry.finishDate() !== undefined && entry.finishDate() !== null; };
            default:
                return function() { return true; };
        }
    }
        
    self.entries = ko.computed(function() {
        var finishTypeFilterFunction = getFinishTypeFilterFunction();
        var justThisPhaseFilterFunction = function(entry) {
            var campaign = currentCampaign();
            if(!campaign)   // campaign isn't set yet, trivially allow all entries
                return true;
                
            return self.justThisPhaseFilter()
                ? entry.createdOnDate() > campaign.lastPhaseStartDate()
                : true;
        };
        
        return makeList($.grep(entryList(), function(entry) {
            return finishTypeFilterFunction(entry) && justThisPhaseFilterFunction(entry);
        }));
    });
};