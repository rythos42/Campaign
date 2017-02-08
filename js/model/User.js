var User = function(id, username) {
    var self = this;
    
    self.id = ko.observable(id);
    self.username = ko.observable(username);
    self.isLoggedIn = ko.observable(false);
};