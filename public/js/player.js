var socket = io();

socket.on('views', function (views) {
    var stream_name = $("#stream_name").val();
    var count = views[stream_name];
    if (!!count) {
        $("#view_count").text(count);
    }
    socket.emit('heartbeat', {token: getToken(), channel_name: stream_name});
});

function getToken() {
    var token = Cookies.get('token');
    if (!token) {
        token = uuidv4();
        Cookies.set('token', token)
    }
    return token;
}
