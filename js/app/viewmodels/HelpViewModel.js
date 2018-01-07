/*exported HelpViewModel */
/*globals SimpleTextDialogWidget */
var HelpViewModel = function() {
    var self = this;
    
    self.contactUsViewModel = new SimpleTextDialogWidget();
    
    self.showContactUs = function() {
        self.contactUsViewModel.openDialog();
    };
};