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
    
    self.hasJoinedCampaign = ko.computed(function() {
        return !!userCampaignData();
    });
        
    self.entries = ko.computed(function() {
        function makeList(list) {
            return $.map(list, function(entry) {
                return new EntryListItemViewModel(entry, navigation, currentCampaign, userCampaignData);
            });
        }
        
        var filter = self.entryFilter();
        if(filter === FilterType.Unfinished)
            return makeList($.grep(entryList(), function(entry) { return entry.finishDate() === undefined || entry.finishDate() === null; }));
        else if(filter === FilterType.Finished) 
            return makeList($.grep(entryList(), function(entry) { return entry.finishDate() !== undefined && entry.finishDate() !== null; }));
        
        return makeList(entryList());
    });
};