/*exported TextFieldDialogViewModel */
/*globals ko, DialogResult */
var TextFieldDialogViewModel = function() {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    self.text = ko.observable();
    
    self.ok = function() {    
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Saved);
    };
    
    self.cancel = function() {
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Cancelled);
    };  
    
    self.openDialog = function() {
        self.text(undefined);
        self.dialogResult(DialogResult.None);
        self.dialogOpenClose(true);
    };
};