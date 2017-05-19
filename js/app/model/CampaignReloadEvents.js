/*exported CampaignReloadEvents */
/*globals ko */
var CampaignReloadEvents = function() {
    var self = this;
    
    self.reloadEntryListRequested = ko.observable(false);
    self.reloadSummaryRequested = ko.observable(false);
    self.reloadMapRequested = ko.observable(false);
    self.reloadPlayersRequested = ko.observable(false);
    
    self.reloadEntryList = function() {
        self.reloadEntryListRequested.notifySubscribers(true);
    };   
    
    self.reloadSummary = function() {
        self.reloadSummaryRequested.notifySubscribers(true);
    };    
    
    self.reloadMap = function() {
        self.reloadMapRequested.notifySubscribers(true);
    };    
    
    self.reloadPlayers = function() {
        self.reloadPlayersRequested.notifySubscribers(true);
    };
};