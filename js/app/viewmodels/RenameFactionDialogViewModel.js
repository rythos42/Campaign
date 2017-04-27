/*exported RenameFactionDialogViewModel */
/*globals ko, DialogResult, Translation */
var RenameFactionDialogViewModel = function(currentCampaign) {
    var self = this;
    
    self.selectedFaction = ko.observable().extend({ required: { message: Translation.getString('selectFaction') } });
    self.newFactionName = ko.observable().extend({ required: { message: Translation.getString('enterNewName') } });
    
    self.factions = ko.computed(function() {
        var campaign = currentCampaign();
        return campaign ? campaign.factions() : null;
    });
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    
    self.renameFaction = function() {   
        if(!self.selectedFaction.isValid() || !self.newFactionName.isValid()) {
            self.selectedFaction.isModified(true);
            self.newFactionName.isModified(true);
            return;
        }
    
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Saved);
    };
    
    self.cancel = function() {
        self.dialogOpenClose(false);
        self.dialogResult(DialogResult.Cancelled);
    };  
    
    self.openDialog = function() {
        self.selectedFaction(null);
        self.selectedFaction.isModified(false);
        self.newFactionName(null);
        self.newFactionName.isModified(false);
        self.dialogResult(DialogResult.None);
        self.dialogOpenClose(true);
    };
};
