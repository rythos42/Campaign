/*exported SelectUserDialogViewModel */
/*globals ko, Translation, DialogResult, User */
var SelectUserDialogViewModel = function() {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    
    self.selectedUser = ko.observable().extend({
        required: { message: Translation.getString('userEntryRequiredValidation') },
        requireObject: { message: Translation.getString('userEntryInvalidAccountValidation') }
    });
    
    self.dialogResult = ko.observable();
    
    self.ok = function() {
        self.closeDialog();
        self.dialogResult(DialogResult.Saved);
    };
    
    self.cancel = function() {
        self.closeDialog();
        self.dialogResult(DialogResult.Cancelled);
    };        
    
    self.openDialog = function() {
        self.dialogResult(DialogResult.None);
        self.dialogOpenClose(true);
    };
    
    self.closeDialog = function() {
        self.dialogOpenClose(false);
    };
    
    self.getUsers = function(term, responseCallback) {
        $.ajax({
            url: 'src/webservices/UserService.php',
            dataType: 'JSON',
            data: {
                action: 'GetUsersByFilter',
                term: term
            },
            success: function(results) {
                responseCallback($.map(results, function(serverUser) {
                    return {
                        label: serverUser.Username,
                        object: new User(serverUser.Id, serverUser.Username)
                    };
                }));
            }
        });
    };
};