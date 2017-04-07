/*exported NewsListViewModel */
/*globals ko, NewsListItemViewModel */
var NewsListViewModel = function(navigation) {
    var self = this,
        internalNewsItems = ko.observableArray(),
        lastLoadedDate = new Date().toISOString().slice(0, 10);
        
    self.reachedEndOfNews = ko.observable(false);
    
    self.showNews = ko.computed(function() {
        return navigation.showMain();
    });
    
    self.newsItems = ko.computed(function() {
        return $.map(internalNewsItems(), function(serverNewsItem) {
            return new NewsListItemViewModel(serverNewsItem);
        });
    });

    self.addMoreNewsItems = function() {
        if(self.reachedEndOfNews())
            return;
        
        $.ajax({
            url: 'src/webservices/NewsService.php',
            method: 'GET',
            data: { 
                action: 'GetMoreNews',
                lastLoadedDate: lastLoadedDate,
                numberToLoad: 10
            },
            dataType: 'JSON'
        }).done(function(serverNewsItems) {
            if(!serverNewsItems || !serverNewsItems.length) {
                self.reachedEndOfNews(true);
                return;
            }
            
            internalNewsItems.push.apply(internalNewsItems, serverNewsItems);
            lastLoadedDate = serverNewsItems[serverNewsItems.length - 1].CreatedOnDate;
        });
    };
    
    self.addMoreNewsItems();
    
    navigation.showMain.subscribe(function(showMain) {
        if(!showMain)
            return;
        
        var since = internalNewsItems().length > 0 ? internalNewsItems()[0].CreatedOnDate : false;
        if(!since)
            return;
        
        // load any new news at the top!
        $.ajax({
            url: 'src/webservices/NewsService.php',
            method: 'GET',
            data: { 
                action: 'GetNewNewsSince',
                since: since
            },
            dataType: 'JSON'
        }).done(function(serverNewsItems) {
            internalNewsItems.unshift.apply(internalNewsItems, serverNewsItems);
        });
    });
};