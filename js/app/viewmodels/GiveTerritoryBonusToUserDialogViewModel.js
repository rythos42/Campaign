/*exported GiveTerritoryBonusToUserDialogViewModel */
/*globals ko, Translation, DialogResult, User */
var GiveTerritoryBonusToUserDialogViewModel = function(user, currentCampaign) {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    
    self.selectedUser = ko.observable().extend({
        required: { message: Translation.getString('userEntryRequiredValidation') },
        requireObject: { message: Translation.getString('userEntryInvalidAccountValidation') }
    });
    
    self.amountToGive = ko.observable().extend({
        required: { message: Translation.getString('howMuch') },
        min: { params: 0, message: Translation.getString('atLeastZero') },
        max: { params: ko.computed(function() {
            var campaign = currentCampaign();
            return campaign ? user.getAvailableTerritoryBonusForCampaign(currentCampaign().id()) : 0;
        }), message: Translation.getString('cannotSpendMoreThan') }
    });
    
    self.dialogResult = ko.observable();
    
    var validation = ko.validatedObservable([
        self.selectedUser,
        self.amountToGive
    ]);
    
    self.ok = function() {
        if(!validation.isValid()) {
            validation.errors.showAllMessages();
            return;
        }
        
        self.closeDialog();
        self.dialogResult(DialogResult.Saved);
    };
    
    self.cancel = function() {
        self.closeDialog();
        self.dialogResult(DialogResult.Cancelled);
    };        
    
    self.openDialog = function() {
        self.selectedUser(null);
        self.selectedUser.isModified(false);
        self.amountToGive(null);
        self.amountToGive.isModified(false);
        
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