var socket = io();

socket.on('reconnect', function () {
    system_success_message('Server is UP!');
});

socket.on('disconnect', function () {
    system_error_message("Server is down. ");
    system_is_down();
});

socket.on('connect', function () {
    system_is_live();
});

socket.on('error', function (data) {
    if (data.error) {
        system_error_message("Please wait a little bit or contact technical support. ");
        system_is_down();
    } else {
        system_hide_message();
        system_is_live();
    }
});

socket.on('statistics', function (statistics) {
    var stream = statistics.server[0].application[0].live[0].stream;
    setLiveStream(stream);
});




