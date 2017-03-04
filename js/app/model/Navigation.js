/*exported Navigation */
/*globals ko */
var Navigation = function(user) {
    var self = this;
    
    self.parameters = ko.observable();
    
    self.showLogin = ko.observable(false);
    self.showMain = ko.observable(false);
    self.showCreateCampaign = ko.observable(false);
    self.showInProgressCampaign = ko.observable(false);
    self.showRegister = ko.observable(false);
    self.showUserProfile = ko.observable(false);
    self.showCreateEntry = ko.observable(false);
    
    var appPages = [
        self.showLogin,
        self.showMain,
        self.showCreateCampaign,
        self.showInProgressCampaign,
        self.showRegister,
        self.showUserProfile,
        self.showCreateEntry
    ];
    
    function showHideAllExcept(show, exceptList) {
        if(!show)
            return;
        
        $.each(appPages, function(index, appShow) {
            if(exceptList.indexOf(appShow) === -1)
                appShow(false);
        });
    }
    
    self.showRegister.subscribe(function(show) { showHideAllExcept(show, [self.showRegister]); });
    self.showLogin.subscribe(function(show) { showHideAllExcept(show, [self.showLogin]); });
    self.showCreateCampaign.subscribe(function(show) { showHideAllExcept(show, [self.showCreateCampaign]); });
    self.showInProgressCampaign.subscribe(function(show) { showHideAllExcept(show, [self.showInProgressCampaign]); });
    self.showMain.subscribe(function(show) { showHideAllExcept(show, [self.showMain]); });
    self.showUserProfile.subscribe(function(show) { showHideAllExcept(show, [self.showUserProfile]); });
    self.showCreateEntry.subscribe(function(show) { showHideAllExcept(show, [self.showCreateEntry]); });
    
    function showLoginOrMainPage() {
        var loggedIn = user.isLoggedIn();
        self.showLogin(!loggedIn);
        self.showMain(loggedIn);
    }
             
    showLoginOrMainPage();     
    user.isLoggedIn.subscribe(showLoginOrMainPage);
};