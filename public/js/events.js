var $player = videojs("PlayStream");

function playStreamEvent() {
    var stream_name = $("#stream_name").val();

    var stream_server = $("#stream_server").val();
    var stream_type = $("#stream_type").val();

    $player.src({
        src: stream_server.replace('{{name}}', stream_name),
        type: stream_type
        // withCredentials: true
    });

    $player.ready(function () {
        var myPlayer = this;
        var aspectRatio = 9 / 16;
        var player = $('#' + myPlayer.id());
        var width = player.parent().width();
        var height = player.parent().height();
        if (width * aspectRatio <= height) {
            myPlayer.width(width);
            myPlayer.height(width * aspectRatio);
        } else {
            myPlayer.height(height);
            myPlayer.width(height * (1 / aspectRatio))
        }

        window.onresize = function () {
            var player = $('#' + myPlayer.id());
            var width = player.parent().width();
            var height = player.parent().height();
            if (width * aspectRatio <= height) {
                myPlayer.width(width);
                myPlayer.height(width * aspectRatio);
            } else {
                myPlayer.height(height);
                myPlayer.width(height * (1 / aspectRatio))
            }
        };

        $player.pause();
        $player.load();
        $player.play();
    });

    $("#channel_name").html(stream_name);
}
