/*exported UserManager */
/*globals User */
var UserManager = {
    getUsersForCampaign: function(term, campaignId, responseCallback) {
        $.ajax({
            url: 'src/webservices/UserService.php',
            dataType: 'JSON',
            data: {
                action: 'GetUsersByFilter',
                term: term,
                campaignId: campaignId
            },
            success: function(results) {
                responseCallback($.map(results, function(serverUser) {
                    return {
                        label: serverUser.Username,
                        object: new User(serverUser.Id, serverUser.Username, serverUser.TerritoryBonus, serverUser.Attacks)
                    };
                }));
            }
        });
    }
};

