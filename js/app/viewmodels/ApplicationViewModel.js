/*exported ApplicationViewModel */
/*globals LoginViewModel, LogoutViewModel, CreateCampaignViewModel, CampaignEntryViewModel, CampaignListViewModel */
var ApplicationViewModel = function(user, navigation) {
    var self = this;

    self.loginViewModel = new LoginViewModel(user, navigation);
    self.logoutViewModel = new LogoutViewModel(user);
    self.createCampaignViewModel = new CreateCampaignViewModel(navigation);
    self.campaignEntryViewModel = new CampaignEntryViewModel(navigation);
    self.campaignListViewModel = new CampaignListViewModel(user, navigation);
};