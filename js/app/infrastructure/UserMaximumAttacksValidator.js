/*globals ko */
ko.validation.rules.userMaximumAttacks = {
    validator: function (isAttacking, params) {
        if(!isAttacking)
            return true;
        
        var user = params.user();
        if(!user)
            return true;
        
        var campaign = params.campaign(),
            maximumAttacks = campaign.mandatoryAttacks() + campaign.optionalAttacks();
        return user.attacks() < maximumAttacks;
    }
};