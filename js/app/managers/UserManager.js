/*exported UserManager */
/*globals User */
var UserManager = {
    __getUsersForCampaign: function(term, campaignId) {
        return $.ajax({
            url: 'src/webservices/UserService.php',
            dataType: 'JSON',
            data: {
                action: 'GetUsersByFilter',
                term: term,
                campaignId: campaignId
            }            
        });
    },
    
    getUsersForCampaign: function(campaignId) {
        return UserManager.__getUsersForCampaign('', campaignId);
    },
    
    getFilteredUsersForCampaign: function(term, campaignId, responseCallback) {
        UserManager.__getUsersForCampaign(term, campaignId).done(function(results) {
            responseCallback($.map(results, function(serverUser) {
                return {
                    label: serverUser.Username,
                    object: new User(serverUser.Id, serverUser.Username, serverUser.TerritoryBonus, serverUser.Attacks)
                };
            }));
        });
    }
};

