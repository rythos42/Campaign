/*exported PushManager */
/*globals _, ko, OneSignal, UserManager */
var PushManager = {
    serverHasPushEnabled: ko.observable(false),
    
    userHasPushEnabled: function() {
        var deferred = $.Deferred();
        OneSignal.push(function() {
            OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                deferred.resolve(isEnabled);
            });
        });
        return deferred;
    },
    
    associateUserWithCampaign: function(campaignId) {
        OneSignal.push(['sendTag', campaignId, true]);
    },
    
    setPushUserIdOnSubscriptionChange: function() {
        OneSignal.push(function() { OneSignal.on('subscriptionChange', function (isSubscribed) {
            if(isSubscribed) {
                OneSignal.push(function() { OneSignal.getUserId(function(userId) {
                    UserManager.setOneSignalUserId(userId);
                });});
                
                // get all users joined campaigns and send them as tags
                UserManager.getAllJoinedCampaignIds().then(function(campaignIds) {
                    var trues = [];
                    for(var i = 0; i < campaignIds.length; i++ )
                        trues[i] = true;
                    
                    var tags = _.object(campaignIds, trues);
                    OneSignal.push(['sendTags', tags]);
                });
            }
            else {
                UserManager.setOneSignalUserId(null);
            }
        });});
    }
};