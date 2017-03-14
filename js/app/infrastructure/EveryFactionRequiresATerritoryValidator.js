/*globals ko */
ko.validation.rules.everyFactionRequiresATerritory = {
    validator: function (factionTerritories, factions) {
        var allHaveTerritories = true;
        $.each(factions, function(index, faction) {
            var hasTerritory = false;
            $.each(factionTerritories, function(territoryId, factionId) {
                if(factionId === faction.id()) {
                    hasTerritory = true;
                    return false;
                }
                return true;
            });
            
            if(!hasTerritory) {
                allHaveTerritories = false;
                return false;
            }
            return true;
        });
        return allHaveTerritories;
    }
};