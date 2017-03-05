/*globals ko */
ko.validation.rules.userMaximumAttacks = {
    validator: function (isAttacking, params) {
        if(!isAttacking)
            return true;
        
        var campaign = params.campaign(),
            maximumAttacks = campaign.mandatoryAttacks() + campaign.optionalAttacks();
        return params.user().getAttacksForCampaign(campaign.id()) < maximumAttacks;
    }
};