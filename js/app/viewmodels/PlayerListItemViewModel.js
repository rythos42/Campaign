/*exported PlayerListItemViewModel */
var PlayerListItemViewModel = function(user) {
    var self = this;
    
    self.username = user.username;
    self.attacks = user.attacks;    
};