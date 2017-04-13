/*exported TagListItemViewModel */
var TagListItemViewModel = function(territory) {
    var self = this;
    
    self.territoryId = territory.Id;
    self.tags = territory.Tags;
};