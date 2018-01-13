/*exported HelpViewModel */
/*globals SimpleTextDialogWidget */
var HelpViewModel = function(navigation) {
    var self = this;
    
    self.contactUsViewModel = new SimpleTextDialogWidget();
    self.creditsViewModel = new SimpleTextDialogWidget();
    self.isShowingHelp = navigation.showHelp;
    
    self.showContactUs = function() {
        self.contactUsViewModel.openDialog();
    };
    
    self.showCredits = function() {
        self.creditsViewModel.openDialog();
    };
    
    self.showHelp = function() {
        self.isShowingHelp(true);
    };
};