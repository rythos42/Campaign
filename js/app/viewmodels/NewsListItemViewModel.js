/*exported NewsListItemViewModel */
/*globals ko, Translation */
var NewsListItemViewModel = function(serverNewsItem) {
    var self = this;
    
    self.news = ko.observable(serverNewsItem ? serverNewsItem.News : '');
    
    self.createdByUserName = ko.observable(serverNewsItem && serverNewsItem.CreatedByUserName ? serverNewsItem.CreatedByUserName : Translation.getString('admin'));
    
    self.smallestText = ko.computed(function() {
        return self.news().length > 150;
    });

    self.smallerText = ko.computed(function() {
        return !self.smallestText() && self.news().length > 40;
    });   
};