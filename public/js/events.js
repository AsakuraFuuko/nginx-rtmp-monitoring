function playStreamEvent() {

    var $player;

    $(".play_stream").click(function () {

        var stream_name = $(this).attr('data-stream-name');

        var stream_server = $("#stream_server").val();
        var stream_type = $("#stream_type").val();

        $("#player").html('<video id="PlayStream" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" width="560px" height="330px" data-setup="{}"> <p class="vjs-no-js">To view this video please enable JavaScript</p> </video>');

        $player = videojs("PlayStream");

        $player.src({
            src: stream_server.replace('{{name}}', stream_name),
            type: stream_type,
            withCredentials: true
        });

        $player.ready(function () {
            $player.pause();
            $player.load();
        });

        $("#channel_name").html(stream_name);

    });

    $('#stream_popup').on('hidden.bs.modal', function () {
        //bad hack to fix my issue with video js reloading
        location.reload();
    })


}
