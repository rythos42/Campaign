/*exported ApplicationViewModel */
/*globals LoginViewModel, LogoutViewModel, CreateCampaignViewModel, InProgressCampaignViewModel, CampaignListViewModel, UserProfileViewModel */
var ApplicationViewModel = function(user, navigation) {
    var self = this;

    self.loginViewModel = new LoginViewModel(user, navigation);
    self.logoutViewModel = new LogoutViewModel(user);
    self.createCampaignViewModel = new CreateCampaignViewModel(user, navigation);
    self.inProgressCampaignViewModel = new InProgressCampaignViewModel(user, navigation);
    self.campaignListViewModel = new CampaignListViewModel(user, navigation);
    self.userProfileViewModel = new UserProfileViewModel(user, navigation);
};