/*exported DateTimeFormatter */
var DateTimeFormatter = {
    formatDate: function(dateString) {
        return new Date(dateString).toLocaleDateString();
    },
    formatDateTime: function(dateString) {
        if(typeof(dateString) === 'string')        
            return new Date(dateString).toLocaleString();
        return dateString.toLocaleString();
    }
};