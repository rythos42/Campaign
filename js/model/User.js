var User = function(id, username) {
    var self = this;
    
    self.id = ko.observable(id);
    self.username = ko.observable(username);
    self.isLoggedIn = ko.observable(false);
    
    self.clone = function() {
        var user = new User();
        user.id(self.id());
        user.username(self.username());
        user.isLoggedIn(self.isLoggedIn());
        return user;
    };
};