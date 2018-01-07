/*exported ApplicationViewModel */
/*globals ko, LoginViewModel, LogoutViewModel, CreateCampaignViewModel, InProgressCampaignViewModel, CampaignListViewModel, UserProfileViewModel, NewsListViewModel */
var ApplicationViewModel = function(user, navigation) {
    var self = this;

    self.loginViewModel = new LoginViewModel(user, navigation);
    self.logoutViewModel = new LogoutViewModel(user);
    self.createCampaignViewModel = new CreateCampaignViewModel(user, navigation);
    self.inProgressCampaignViewModel = new InProgressCampaignViewModel(user, navigation);
    self.campaignListViewModel = new CampaignListViewModel(user, navigation);
    self.userProfileViewModel = new UserProfileViewModel(user, navigation);
    self.newsListViewModel = new NewsListViewModel(user, navigation);
    self.helpViewModel = new HelpViewModel(user, navigation);
    
    self.showOpenSideBarButton = ko.computed(function() {
        return user.isLoggedIn();
    });
    
    self.isSideBarOpen = navigation.isSideBarOpen;
    
    user.isLoggedIn.subscribe(function(isLoggedIn) {
        if(!isLoggedIn)
            self.isSideBarOpen(false);
    });
    
    self.inProgressCampaignViewModel.joinedCampaign.subscribe(function(joinedCampaign) {
        if(joinedCampaign)
            self.campaignListViewModel.addToJoinedList(joinedCampaign);
    });
};