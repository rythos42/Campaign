/*exported DateTimeFormatter */
var DateTimeFormatter = {
    formatDate: function(dateString) {
        return new Date(dateString).toLocaleDateString();
    }
};