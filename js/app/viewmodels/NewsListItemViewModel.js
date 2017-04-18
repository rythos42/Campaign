/*exported NewsListItemViewModel */
/*globals ko, Translation */
var NewsListItemViewModel = function(serverNewsItem) {
    var self = this,
        newsText = serverNewsItem ? serverNewsItem.News : '',
        maxDisplayedLength = 400,
        isShowingLess = ko.observable(true);
    
    self.createdByUserName = ko.observable(serverNewsItem && serverNewsItem.CreatedByUserName ? serverNewsItem.CreatedByUserName : Translation.getString('admin'));
    
    self.showMoreLessButtons = ko.computed(function() {
        return newsText.length > maxDisplayedLength;
    });
    
    self.news = ko.computed(function() {
        var text = newsText.replace(/(?:\r\n|\r|\n)/g, '<br />');

        if(self.showMoreLessButtons() && isShowingLess())
            return text.substring(0, maxDisplayedLength);

        return text;
    });
    
    self.smallestText = ko.computed(function() {
        return newsText.length > 150;
    });

    self.smallerText = ko.computed(function() {
        return !self.smallestText() && newsText.length > 40;
    });
    
    self.showMoreLessButtonText = ko.computed(function() {
        return '[' + (isShowingLess() ? Translation.getString('more') : Translation.getString('less')) + ']';
    });
    
    self.isCampaignNews = ko.computed(function() {
        return serverNewsItem.CampaignName !== null;
    });
    
    self.campaignName = ko.computed(function() {
        return serverNewsItem.CampaignName;
    });
    
    self.toggleMoreLess = function() {
        isShowingLess(!isShowingLess());
    };
};