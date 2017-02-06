var ApplicationViewModel = function(user, campaign, navigation) {
    var self = this;

    self.loginViewModel = new LoginViewModel(user, navigation);
    self.logoutViewModel = new LogoutViewModel(user, navigation);
    self.createCampaignViewModel = new CreateCampaignViewModel(campaign, navigation);
    self.createCampaignEntryViewModel = new CreateCampaignEntryViewModel(navigation);
}