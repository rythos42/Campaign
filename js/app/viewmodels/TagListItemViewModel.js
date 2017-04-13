/*exported TagListItemViewModel */
var TagListItemViewModel = function(territory) {
    var self = this;
    
    self.territoryId = territory.IdOnMap;
    self.tags = territory.Tags;
};