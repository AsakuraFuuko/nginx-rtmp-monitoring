function drop_publisher(app_name, stream_name) {
    var control_server = $("#control_server").val() + "/drop/publisher?app=" + app_name + "&name=" + stream_name;
    console.log('drop: ' + stream_name + ' from URL:' + control_server);

    var jqxhr = $.get(control_server, function (data, status) {
        console.log('Status: ' + status + ' Data: ' + data);
    });

}

function dropStreamEvent() {

    $(".drop_stream").click(function () {
        var stream_name = $(this).attr('data-stream-name');

        $("#stream_drop_popup").modal('show');

        $("#modal-btn-yes").on("click", function () {
            drop_publisher("live", stream_name);
            $("#stream_drop_popup").modal('hide');
        });

        $("#modal-btn-no").on("click", function () {
            $("#stream_drop_popup").modal('hide');
        });

        $("#channel_name_drop").html(stream_name);
    });
}

var $player = videojs("PlayStream");

function playStreamEvent() {
    $(".play_stream").click(function () {

        var stream_name = $(this).attr('data-stream-name');

        var stream_server = $("#stream_server").val();
        var stream_type = $("#stream_type").val();

        $player.src({
            src: stream_server.replace('{{name}}', stream_name),
            type: stream_type,
            // withCredentials: true
        });

        $player.ready(function () {
            $player.pause();
            $player.load();
        });

        $("#channel_name_play").html(stream_name);

    });

    $('#stream_popup').on('hidden.bs.modal', function () {
        //bad hack to fix my issue with video js reloading
        // location.reload();
        $player.reset();
    })
}
