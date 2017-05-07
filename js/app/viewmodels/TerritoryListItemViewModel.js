/*exported TerritoryListItemViewModel */
/*globals ko */
var TerritoryListItemViewModel = function(territory) {
    var self = this;
    
    self.isEditing = ko.observable(false);
    self.hasFocus = ko.observable(false);
    
    self.territoryId = territory.IdOnMap;
    self.tags = ko.observable(territory.Tags);
    
    self.ownedBy = ko.observable(territory.AttackingFactionName);
    
    self.editTag = function() {
        self.isEditing(true);
        self.hasFocus(true);
    };
    
    self.saveTag = function() {
        self.isEditing(false);
        
        setTimeout(function() {
            territory.Tags = self.tags();
            $.ajax({
                url: 'src/webservices/CampaignService.php',
                data: {
                    action: 'UpdateTags',
                    territoryId: territory.Id,
                    newTags: self.tags()
                }
            });
        }, 0);
    };
};