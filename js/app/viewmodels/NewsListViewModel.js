/*exported NewsListViewModel */
/*globals ko, NewsListItemViewModel */
var NewsListViewModel = function(navigation) {
    var self = this,
        internalNewsItems = ko.observableArray();
    
    self.showNews = ko.computed(function() {
        return navigation.showMain();
    });
    
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
    
    navigation.showMain.subscribe(function(showMain) {
        if(!showMain)
            return;
        
        getMainPageNews();
    });
};