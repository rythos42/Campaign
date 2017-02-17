/*exported Navigation */
/*globals ko */
var Navigation = function(user) {
    var self = this;
    
    self.parameters = ko.observable();
    
    self.showLogin = ko.observable(false);
    self.showMain = ko.observable(false);
    self.showCreateCampaign = ko.observable(false);
    self.showCreateCampaignEntry = ko.observable(false);
    self.showRegister = ko.observable(false);
    
    function showHideAllExcept(show, except) {
        if(!show)
            return;
        
        if(except !== self.showLogin) self.showLogin(false);
        if(except !== self.showMain) self.showMain(false);
        if(except !== self.showCreateCampaign) self.showCreateCampaign(false);
        if(except !== self.showCreateCampaignEntry) self.showCreateCampaignEntry(false);
        if(except !== self.showRegister) self.showRegister(false);
    }
    
    self.showRegister.subscribe(function(show) { showHideAllExcept(show, self.showRegister); });
    self.showLogin.subscribe(function(show) { showHideAllExcept(show, self.showLogin); });
    self.showCreateCampaign.subscribe(function(show) { showHideAllExcept(show, self.showCreateCampaign); });
    self.showCreateCampaignEntry.subscribe(function(show) { showHideAllExcept(show, self.showCreateCampaignEntry); });
    self.showMain.subscribe(function(show) { showHideAllExcept(show, self.showMain); });
    
    
    function showLoginOrMainPage() {
        var loggedIn = user.isLoggedIn();
        self.showLogin(!loggedIn);
        self.showMain(loggedIn);
    }
             
    showLoginOrMainPage();     
    user.isLoggedIn.subscribe(showLoginOrMainPage);
};