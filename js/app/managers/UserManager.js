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
                return new User(serverUser);
            }));
        });
    },
        
    refreshUserDataForCampaign: function(campaignId) {
        return $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'POST',
            dataType: 'JSON',
            data: { action: 'GetUserDataForCampaign', campaignId: campaignId }
        });
    },
    
    setOneSignalUserId: function(oneSignalUserId) {
        return $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'POST',
            dataType: 'JSON',
            data: { action: 'SetOneSignalUserId', oneSignalUserId: oneSignalUserId }
        });
    },
    
    getAllJoinedCampaignIds: function() {
        return $.ajax({
            url: 'src/webservices/UserService.php',
            method: 'GET',
            dataType: 'JSON',
            data: { action: 'GetAllJoinedCampaignIds' }
        });
    }
};