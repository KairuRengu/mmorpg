    var port = process.env.PORT || 8005
    var io = require('socket.io')({ transports: ['websocket'] });
    var express = require('express')
    var cookieParser = require('cookie-parser')
    var UUID = require('node-uuid')
    var http = require('http')
    var app = express()
    app.use(cookieParser())
    app.use(express.static(__dirname + '/public'));
    app.set('superSecret', "KeySecret");
    var server = http.createServer(app)
    server.listen(port)
    console.log('Server Started on Port:  ' + port);
    app.get('/', function(req, res) {
        res.sendFile('index.html');
    });
    app.get('/*', function(req, res, next) {
        var file = req.params[0];
        res.sendFile(__dirname + '/' + file);
    });

    var socket = io.listen(server);
    require('./engine/js/serverEngine.js')(app, UUID, socket);
