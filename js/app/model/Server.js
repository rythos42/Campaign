/*exported Server */
var Server = function() {
    var self = this,
        installDirectory;
    
    self.setInstallDirectory = function(newInstallDirectory) {
        installDirectory = newInstallDirectory;
    };
    
    self.getInstallDirectory = function() {
        return installDirectory;
    };
};