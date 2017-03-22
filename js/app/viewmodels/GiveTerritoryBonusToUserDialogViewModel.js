/*exported GiveTerritoryBonusToUserDialogViewModel */
/*globals ko, Translation, DialogResult, UserManager */
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
        max: { params: user.territoryBonus, message: Translation.getString('cannotSpendMoreThan') }
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
        var campaign = currentCampaign(),
            campaignId = campaign ? campaign.id() : 0;
            
        UserManager.getUsersForCampaign(term, campaignId, responseCallback);
    };
};