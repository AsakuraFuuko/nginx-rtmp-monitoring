var express = require("express");
var session = require('express-session');
var request = require('request');
var parseString = require('xml2js').parseString;
var config = require('./config.json');
var language = require('./language/' + config.language + '.json');
var app = express();
app.use(express.static('public'));
var server = app.listen(config.http_server_port, config.http_server_name, function () {
    console.log('server is listening on ' + config.http_server_port);
});
var io = require('socket.io').listen(server);
var os = require("os");
var memory = require('node-free');
var swig = require('swig');
swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/template/');


function customHeaders(req, res, next) {
    app.disable('x-powered-by');
    res.setHeader('X-Powered-By', "fstv monitoring " + config.version);
    next()
}

app.use(customHeaders);

app.use(session({
    secret: config.session_secret_key,
    resave: true,
    saveUninitialized: true
}));

var auth = function (req, res, next) {
    if (req.session && req.session.user === "fstn" && req.session.admin)
        return next();
    else
        return res.sendStatus(401);
};

app.get('/admin/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});

app.get('/admin/login', function (req, res) {

    if (!req.query.username || !req.query.password) {
        res.send('login failed');
        return;
    }

    if (req.query.username === config.username && req.query.password === config.password) {
        req.session.user = "fstn";
        req.session.admin = true;
        res.send("login success!");
        return;
    }

    res.send("login failed!");

});

app.get('/', function (req, res) {
    res.render('index', {
        title: config.site_title,
        language: language,
        version: config.version
    });
});

app.get('/player/:channel_name', function (req, res) {
    res.render('player', {
        title: config.site_title,
        language: language,
        version: config.version,
        channel_name: req.params.channel_name,
        stream_server: config.rtmp_server_stream_url,
        stream_type: config.rtmp_server_stream_type,
        control_server: config.rtmp_server_control_url
    });
});

app.get('/admin', auth, function (req, res) {
    res.render('admin', {
        title: config.site_title,
        language: language,
        version: config.version,
        stream_server: config.rtmp_server_stream_url,
        stream_type: config.rtmp_server_stream_type,
        control_server: config.rtmp_server_control_url
    });
});

app.get('*', function (req, res) {
    res.redirect('/');
});

function cpuAverage() {
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();
    for (var i = 0, len = cpus.length; i < len; i++) {
        var cpu = cpus[i];
        for (type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    }
    return {idle: totalIdle / cpus.length, total: totalTick / cpus.length};
}

var startMeasure = cpuAverage();


setInterval(function () {

    setTimeout(function () {
        var endMeasure = cpuAverage();
        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;
        var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
        var used_memory = memory.used() / 1024;
        io.emit('server', {
            used_cpu: percentageCPU,
            used_memory: used_memory
        });
        io.emit('views', getViews());
        removeDeactive()
    }, 100);

    request.get(config.rtmp_server_url, {timeout: config.rtmp_server_timeout}, function (error, meta, xml) {

        if (error) {
            io.emit('error', {"error": true});
        }

        parseString(xml, function (err, result) {

            if (err != null) {
                io.emit('error', {"error": true});
            } else {
                io.emit('error', {"error": false});
            }

            if (err != null) {
                io.emit('statistics', result);
            } else {
                var rtmp = result.rtmp;
                var streams = rtmp.server[0].application[0].live[0].stream;
                if (streams) {
                    for (var index = 0; index < streams.length; index++) {
                        var view = views[streams[index].name[0]];
                        if (!!view) {
                            streams[index].nclients = [Object.keys(view.sessions).length.toString()];
                        } else {
                            streams[index].nclients = ["0"]
                        }
                        streams[index].client = []
                    }
                    rtmp.server[0].application[0].live[0].stream = streams;
                }
                io.emit('statistics', rtmp);
            }

        });

    });

}, config.rtmp_server_refresh);

var views = {};

function heartbeat(channel_name, token) {
    var view = views[channel_name];
    var now = timestamp();
    if (!!view) {
        view.sessions[token] = now
    } else {
        views[channel_name] = {sessions: {}};
    }
    return views[channel_name].sessions.length || 0;
}

function timestamp() {
    return Math.round((new Date).getTime() / 1000)
}

function getViews() {
    var v = {};
    for (var key in views) {
        v[key] = Object.keys(views[key].sessions).length
    }
    return v;
}

function removeDeactive() {
    var now = timestamp();
    for (var key in views) {
        var sessions = views[key].sessions;
        for (var key2 in sessions) {
            if (now - sessions[key2] > 30) {
                delete views[key].sessions[key2]
            }
        }
    }
}

io.on('connection', function (socket) {
    socket.on('heartbeat', function (hb) {
        heartbeat(hb.channel_name, hb.token)
    });
});
