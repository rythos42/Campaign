/*exported NewsListViewModel */
/*globals ko, NewsListItemViewModel */
var NewsListViewModel = function() {
    var self = this,
        internalNewsItems = ko.observableArray();
    
    self.newsItems = ko.computed(function() {
        return $.map(internalNewsItems(), function(serverNewsItem) {
            return new NewsListItemViewModel(serverNewsItem);
        });
    });
    
    function getMainPageNews() {
        $.ajax({
            url: 'src/webservices/NewsService.php',
            method: 'GET',
            data: { action: 'GetMainPageNews' },
            dataType: 'JSON'
        }).done(function(serverNewsItems) {
            internalNewsItems(serverNewsItems);
        });
    }
    
    getMainPageNews();
};