function setLiveStream(data) {
    var table = "";
    var language_play = $("#language_play").val();
    $.each(data, function (index, channel) {
        var name = "<td class='text-center'>" + channel.name[0] + "</td>";
        var time = "<td class='text-center hidden-xs hidden-sm'>" + secondsToHuman(channel.time[0] / 1000) + "</td>";
        var viewers = "<td class='text-center'><b>" + numeral(channel.nclients[0]).format('0,0') + "<b/></td>";
        var v_w = 0;
        var v_h = 0;
        if (typeof channel.meta !== 'undefined') {
            v_w = channel.meta[0].video[0].width[0];
            v_h = channel.meta[0].video[0].height[0];
        }
        var resolution = "<td class='text-center'>" + v_w + " X " + v_h + "</td>";
        var play = "<td class='text-center'><a class='btn btn-default play_stream' href='player/" + channel.name[0] + "'><i class='glyphicon glyphicon-play'></i> <span class='hidden-xs'>" + language_play + "</span></a></td>";
        table = table + "<tr>" + name + resolution + viewers + time + play + "</tr>";
    });
    if (!table) {
        table = "<tr><td colspan='5'>no streams</td></tr>";
    }
    $("#live_stream").html(table);
}
