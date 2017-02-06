var ApplicationViewModel = function(user, campaign) {
    var self = this;

    self.loginViewModel = new LoginViewModel(user);
    self.logoutViewModel = new LogoutViewModel(user);
    self.createCampaignViewModel = new CreateCampaignViewModel(user, campaign);
}