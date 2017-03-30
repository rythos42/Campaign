/*exported DropDownListDialogViewModel */
/*globals ko, DialogResult */
var DropDownListDialogViewModel = function(options, textProperty, caption) {
    var self = this;
    
    self.options = options;
    self.textProperty = textProperty;
    self.caption = caption;
    self.selectedValue = ko.observable();
    
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
        self.selectedValue(undefined);
        self.dialogResult(DialogResult.None);
        self.dialogOpenClose(true);
    };
};