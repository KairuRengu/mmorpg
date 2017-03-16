    var port = process.env.PORT || 8005
    var io = require('socket.io')({ transports: ['websocket'] });
    var express = require('express')
    var mongoose = require('mongoose');
    var config = require('./config/database.js');
    var cookieParser = require('cookie-parser')
    var UUID = require('node-uuid')
    var http = require('http')
    var app = express()
    app.use(cookieParser())
    app.use(express.static(__dirname + '/public'));
    mongoose.connect(config.url); // connect to our database
    app.set('superSecret', config.secret); // secret variable
    console.log("===========================================Starting Server");
    var server = http.createServer(app).listen(port)
    console.log("Server Started On Port: " + port);
    var socket = io.listen(server);
    console.log("Socket.IO Server Started");
    console.log("===========================================Loading Worlds");
    var Zone = require("./public/js/classes/Zone.js");
    var Zones = require("./public/js/classes/Zones.js");
    var Zones = new Zones();
    var fs = require('fs');
    loadMap(function() {
        console.log("===========================================Starting Game Engine");
        require('./public/js/engine/serverEngine')(app, UUID, socket, Zones);
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
        console.log("===========================================Ready For Users\r\n");
    })

    function loadMap(callback) {
        var zonesDir = "./public/gameData/zones/"
        fs.readdir(zonesDir, (err, files) => {
            files.forEach(file => {
                var currentZone = JSON.parse(fs.readFileSync(zonesDir + file, 'utf8'));
                var newZone = new Zone(currentZone.name,currentZone.width,currentZone.height,currentZone.textureMap,currentZone.actionMap,currentZone.entities)
                Zones.addZone(newZone)
                console.log("Loaded [ " + newZone.getName() + " ]")
            });
            callback()
        })
    }
