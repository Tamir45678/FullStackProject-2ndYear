
// Create success alert with passed message 
function successAlert(msg) {
    $.notifyBar({
        html: msg, cssClass: "success", closeOnClick: true
    });

}

// Create error alert with passed message 
function errorAlert(msg) {
    $.notifyBar({
        html: msg, cssClass: "error", close: true, closeText: '&times;', closeOnClick: true
    });
}

