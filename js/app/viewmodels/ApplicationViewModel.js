/*exported ApplicationViewModel */
/*globals LoginViewModel, LogoutViewModel, CreateCampaignViewModel, InProgressCampaignViewModel, CampaignListViewModel */
var ApplicationViewModel = function(user, navigation) {
    var self = this;

    self.loginViewModel = new LoginViewModel(user, navigation);
    self.logoutViewModel = new LogoutViewModel(user);
    self.createCampaignViewModel = new CreateCampaignViewModel(user, navigation);
    self.inProgressCampaignViewModel = new InProgressCampaignViewModel(navigation);
    self.campaignListViewModel = new CampaignListViewModel(user, navigation);
};