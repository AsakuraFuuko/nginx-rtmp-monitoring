function playStreamEvent() {
    var $player;
    var stream_name = $("#stream_name").val();

    var stream_server = $("#stream_server").val();
    var stream_type = $("#stream_type").val();

    $("#player").html('<video id="PlayStream" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" width="560px" height="330px" data-setup="{}"> <p class="vjs-no-js">To view this video please enable JavaScript</p> </video>');

    $player = videojs("PlayStream");

    $player.src({
        src: stream_server.replace('{{name}}', stream_name),
        type: stream_type
        // withCredentials: true
    });

    $player.ready(function () {
        var myPlayer = this;
        var aspectRatio = 9 / 16;
        var width = $('#' + myPlayer.id()).parent().width();
        myPlayer.width(width);
        myPlayer.height(width * aspectRatio);
        window.onresize = function () {
            var width = $('#' + myPlayer.id()).parent().width();
            myPlayer.width(width);
            myPlayer.height(width * aspectRatio);
        };
        $player.pause();
        $player.load();
    });

    $("#channel_name").html(stream_name);
}

playStreamEvent();
