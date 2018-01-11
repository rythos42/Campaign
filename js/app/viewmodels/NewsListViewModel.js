/*exported NewsListViewModel */
/*globals ko, NewsListItemViewModel */
var NewsListViewModel = function(user, navigation) {
    var self = this,
        internalNewsItems = ko.observableArray(),
        lastLoadedDate;

    self.reachedEndOfNews = ko.observable(false);

    function resetLastLoadedDate() {
        var today = new Date(),
            month = today.getMonth(),
            date = today.getDate();
            
        month = month + 1 < 10 ? '0' + (month + 1) : month + 1;
        date = date < 10 ? '0' + date : date;
        lastLoadedDate = today.getFullYear() + '-' + month + '-' + date + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    }
    resetLastLoadedDate();
    
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
    
    user.isLoggedIn.subscribe(function(isLoggedIn) {
        if(!isLoggedIn) {
            resetLastLoadedDate();
            internalNewsItems.removeAll();
            self.reachedEndOfNews(false);
            return;
        }
        
        self.addMoreNewsItems();
    });
    
    if(user.isLoggedIn())    
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