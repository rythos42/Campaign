/*exported NewsListItemViewModel */
/*globals ko, Translation */
var NewsListItemViewModel = function(serverNewsItem) {
    var self = this;
    
    self.news = ko.observable(serverNewsItem ? serverNewsItem.News : '');
    
    self.createdByUserName = ko.observable(serverNewsItem && serverNewsItem.CreatedByUserName ? serverNewsItem.CreatedByUserName : Translation.getString('admin'));
};