var ApplicationViewModel = function(user, navigation) {
    var self = this;

    self.loginViewModel = new LoginViewModel(user, navigation);
    self.logoutViewModel = new LogoutViewModel(user, navigation);
    self.createCampaignViewModel = new CreateCampaignViewModel(navigation);
    self.createCampaignEntryViewModel = new CreateCampaignEntryViewModel(navigation);
    self.campaignListViewModel = new CampaignListViewModel(navigation);
}