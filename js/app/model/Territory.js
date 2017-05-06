/*exported Territory */
/*globals ko */
var Territory = function(serverTerritory) {
    var self = this;
    
    self.attackingFactionId = ko.observable(serverTerritory ? serverTerritory.AttackingFactionId : undefined);
    self.idOnMap = ko.observable(serverTerritory ? serverTerritory.IdOnMap : undefined);
    self.attackingUsername = ko.observable(serverTerritory ? serverTerritory.AttackingUsername : undefined);
    self.attackingUserId = ko.observable(serverTerritory ? serverTerritory.AttackingUserId : undefined);
    self.owningFactionId = ko.observable(serverTerritory ? serverTerritory.OwningFactionId : undefined);
    self.tags = ko.observable(serverTerritory ? serverTerritory.Tags : undefined);
};