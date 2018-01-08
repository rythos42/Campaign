/*exported HelpViewModel */
/*globals SimpleTextDialogWidget */
var HelpViewModel = function() {
    var self = this;
    
    self.contactUsViewModel = new SimpleTextDialogWidget();
    self.creditsViewModel = new SimpleTextDialogWidget();
    
    self.showContactUs = function() {
        self.contactUsViewModel.openDialog();
    };
    
    self.showCredits = function() {
        self.creditsViewModel.openDialog();
    };
};