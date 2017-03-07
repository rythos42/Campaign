/*exported UserManager */
/*globals User */
var UserManager = {
    getUsers: function(term, responseCallback) {
        $.ajax({
            url: 'src/webservices/UserService.php',
            dataType: 'JSON',
            data: {
                action: 'GetUsersByFilter',
                term: term
            },
            success: function(results) {
                responseCallback($.map(results, function(serverUser) {
                    return {
                        label: serverUser.Username,
                        object: new User(serverUser.Id, serverUser.Username, serverUser.UserCampaignData)
                    };
                }));
            }
        });
    }
};

