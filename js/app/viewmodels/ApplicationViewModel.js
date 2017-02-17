/*exported ApplicationViewModel */
/*globals LoginViewModel, LogoutViewModel, CreateCampaignViewModel, CreateCampaignEntryViewModel, CampaignListViewModel */
var ApplicationViewModel = function(user, navigation, server) {
    var self = this;

    self.loginViewModel = new LoginViewModel(user, navigation, server);
    self.logoutViewModel = new LogoutViewModel(user, server);
    self.createCampaignViewModel = new CreateCampaignViewModel(navigation, server);
    self.createCampaignEntryViewModel = new CreateCampaignEntryViewModel(navigation, server);
    self.campaignListViewModel = new CampaignListViewModel(user, navigation, server);
};