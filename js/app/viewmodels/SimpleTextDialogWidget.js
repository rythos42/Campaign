/*exported SimpleTextDialogWidget */
/*globals ko, DialogResult */
var SimpleTextDialogWidget = function() {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    
    self.ok = function() {    
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Saved);
    };
    
    self.openDialog = function() {
        self.dialogResult(DialogResult.None);
        self.dialogOpenClose(true);
    };
};