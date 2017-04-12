/*exported EditTerritoryDialogViewModel */
/*globals ko, DialogResult, Translation */
var EditTerritoryDialogViewModel = function(entryCampaign) {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    self.selectedTerritory = ko.observable();
    self.selectedFaction = ko.observable();
    self.availableFactions = entryCampaign.factions;
    
    self.dialogTitle = ko.computed(function() {
        var selectedTerritory = self.selectedTerritory();
        return selectedTerritory ? Translation.getString('editTerritory') + ' ' + selectedTerritory.IdOnMap : '';
    });
    
    self.save = function() {    
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