var socket = io();

var stream_name = $("#stream_name").val();
var title_temp = $("#title_temp").val();
var playing = $("#playing").val();
var offline = $("#offline").val();
var title = $("title");
var nav_title = $("#nav-title");
var player_panel = $("#player-panel");

socket.on('views', function (views) {
    var stream_name = $("#stream_name").val();
    var count = views[stream_name];
    if (!!count) {
        $("#view_count").text(count);
    }
    socket.emit('heartbeat', {token: getToken(), channel_name: stream_name});
});

socket.on('statistics', function (statistics) {
    var streams = statistics.server[0].application[0].live[0].stream;
    if (streams) {
        var status = false;
        for (var index = 0; index < streams.length; index++) {
            if (streams[index].name[0] === stream_name) {
                status = true;
            }
        }
        var title_str = title_temp.replace('%status%', status ? playing : offline);
        title.text(title_str);
        nav_title.html(title_str);
        status ? player_panel.show() : player_panel.hide()
    }
});

function getToken() {
    var token = Cookies.get('token');
    if (!token) {
        token = uuidv4();
        Cookies.set('token', token)
    }
    return token;
}
