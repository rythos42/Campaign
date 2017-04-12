/*exported TerritoryDetailsDialogViewModel */
/*globals ko, DialogResult, Translation */
var TerritoryDetailsDialogViewModel = function(currentCampaign) {
    var self = this;
    
    self.dialogOpenClose = ko.observable(false);
    self.dialogResult = ko.observable(DialogResult.None);
    self.territory = ko.observable();
    
    self.dialogTitle = ko.computed(function() {
        var territory = self.territory();
        return territory ? Translation.getString('territory') + ' ' + territory.Id : '';
    });
    
    self.tags = ko.computed(function() {
        var territory = self.territory();
        return territory ? territory.Tags : '';
    });
    
    self.ownedBy = ko.computed(function() {
        var campaign = currentCampaign(),
            territory = self.territory();
            
        if(!campaign || !territory)
            return '';
        
        return campaign.getFactionById(territory.OwningFactionId).name();
    });
    
    self.attack = function() {    
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