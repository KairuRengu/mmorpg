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
    console.log("===========================================Starting Server");
    var server = http.createServer(app).listen(port)
    console.log("Server Started On Port: " + port);
    var socket = io.listen(server);
    console.log("Socket.IO Server Started");
    console.log("===========================================Loading Worlds");
    var World = require("./engine/classes/World").World();
    console.log("===========================================Starting Game Engine");
    require('./engine/js/serverEngine.js')(app, UUID, socket, World);
    console.log("Game Engine Started");
    console.log("===========================================Serving Static Files");
    app.get('/', function(req, res) {
        res.sendFile('index.html');
    });
    app.get('/*', function(req, res, next) {
        var file = req.params[0];
        res.sendFile(__dirname + '/' + file);
    });
    console.log("Files Served");
    console.log("===========================================Ready For Users");
