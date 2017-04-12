/*exported EditTerritoryDialogViewModel */
/*globals ko, DialogResult, Translation */
var EditTerritoryDialogViewModel = function(entryCampaign) {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    self.selectedTerritory = ko.observable();
    self.selectedFaction = ko.observable();
    self.availableFactions = entryCampaign.factions;

    self.tags = ko.observable().extend({
        maxLength: { params: 100, message: Translation.getString('tagsMaxLengthValidation') }
    });
    
    self.dialogTitle = ko.computed(function() {
        var selectedTerritory = self.selectedTerritory();
        return selectedTerritory ? Translation.getString('editTerritory') + ' ' + selectedTerritory.IdOnMap : '';
    });
    
    self.save = function() {
        if(!self.tags.isValid()) {
            self.tags.isModified(true);
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
        self.dialogResult(DialogResult.None);
        self.dialogOpenClose(true);
    };
};