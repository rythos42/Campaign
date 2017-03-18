/*exported ConfirmationDialogViewModel */
/*globals ko, DialogResult */
var ConfirmationDialogViewModel = function() {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    
    self.ok = function() {    
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Saved);
    };
    
    self.cancel = function() {
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Cancelled);
    };  
    
    self.openDialog = function() {
        self.dialogResult(DialogResult.None);
        self.dialogOpenClose(true);
    };
};