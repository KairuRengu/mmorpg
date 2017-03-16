Player = require("../classes/Player").Player;
var DB = require('../../../models/models');
//////////////////////////////////////////////////////////////////////////////////////////
//Singleton
module.exports = function(app, UUID, socket, Zones) {
        socket.sockets.on('connection', function(client) {
            console.log('Unknown Player Connected');
            client.on("login", playerLogin);
            client.on("disconnect", disconnectPlayer);
            client.on("getPlayersServer", getPlayers);
            client.on("actionPlayerServer", actionPlayer);
            // client.on("useActionPlayerServer", useActionPlayer);
            // client.on("attackActionPlayerServer", attackActionPlayer);
        });

        function playerLogin(data) {
            var client = this
            DB.User.findOne({ 'user.email': data.email }, { 'user.password': 0 }, function(err, user) {
                if (user) {
                	client.userid = user._id
                    //
                    // var removePlayer = Zones.getPlayerById(client.userid);
                    // console.log(removePlayer)
                    // if (!!removePlayer) {
                    //     client.emit("loginResponse", { status: false, message: "Player Already Logged In!" })
                    //     return
                    // }
                    //
                    console.log('\r\nPlayer Connected');
                    
                    var newPlayer = new Player(client.userid);
                    newPlayer.setName(user.player.name)
                    newPlayer.setX(user.player.xCoord)
                    newPlayer.setY(user.player.yCoord)
                    newPlayer.setZone(user.player.zone)
                    newPlayer.setHealth(user.player.health)
                    newPlayer.setMana(user.player.mana)
                    newPlayer.setEquipt(user.player.equipt)
                    newPlayer.setInventory(user.player.inventory)
                    Zones.addPlayer(newPlayer)
                    console.log('Player ID: ' + newPlayer.getID());
                    console.log('Player Name: ' + newPlayer.getName());
                    console.log('Player Location: ' + newPlayer.getX() + "," + newPlayer.getY());
                    console.log("Player added to Zone: " + newPlayer.getZone())
                    client.emit("loginResponse", { status: true, id: newPlayer.getID(), player: user.player, zone: Zones.getZones()[0].getSerializedZone() })
                    socket.emit("newPlayerClient", newPlayer.getSerializedPlayer());
                    console.log("----")
                    console.log("Current Players: " + Zones.getPlayers().length)
                } else {
                    console.log("Failed To Authenticate User: " + client.userid)
                    client.emit("loginResponse", { status: false, message: "Invalid Credentials!" })
                }
            })
        }
        // function useActionPlayer(data) {
        //     var actionPlayer = World.getPlayerById(data.id);
        //     if (!actionPlayer) {
        //         console.log("USE | Player not found: " + data.id);
        //         return;
        //     };
        //     var entityTile = World.getCoordTileAdj(actionPlayer.getX(), actionPlayer.getY(), actionPlayer.getDir())
        //     var entity = World.getEntityAt(entityTile.x, entityTile.y)
        //     if (!!entity) {
        //         console.log("Result: " + entity.text)
        //     }
        // }
        // function attackActionPlayer(data) {
        //     var actionPlayer = World.getPlayerById(data.id);
        //     if (!actionPlayer) {
        //         console.log("ATTACK | Player not found: " + data.id);
        //         return;
        //     };
        //     console.log("Player " + data.id + " pressed ATTACK on coord: " + actionPlayer.getX() + "," + actionPlayer.getY() + " facing " + actionPlayer.getDir())
        // }
        function disconnectPlayer() {
            if (!this.userid) return;
            console.log('Player Disconnected: ' + this.userid);
            var removePlayer = Zones.getPlayerById(this.userid);
            if (!removePlayer) {
                console.log("Disconnect | Player not found: " + this.userid);
                return;
            }
            this.broadcast.emit("removePlayerClient", { id: removePlayer.getID() });
            Zones.removePlayer(removePlayer);
            console.log("Current Players: " + Zones.getPlayers().length)
        }

        function getPlayers() {
            console.log("Sending Player Data " + this.userid)
            var players = Zones.getPlayers()
            for (var i = 0; i < players.length; i++) {
                this.emit("newPlayerClient", players[i].getSerializedPlayer());
            };
        }

        function actionPlayer(data) {
            var actionPlayer = Zones.getPlayerById(data.id);
            // Player not found
            if (!actionPlayer) {
                console.log("Player not found: " + data.id);
                return;
            };
            switch (data.action) {
                case "move":
                    // Update player position
                    actionPlayer.setX(data.x);
                    actionPlayer.setY(data.y);
                    actionPlayer.setDir(data.dir);
                    // Broadcast updated position to connected socket clients
                    this.broadcast.emit("actionPlayerClient", { id: actionPlayer.getID(), x: actionPlayer.getX(), y: actionPlayer.getY(), dir: actionPlayer.getDir(), action: "move" });
                    break;
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////
