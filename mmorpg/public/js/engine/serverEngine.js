Player = require("../classes/Player").Player;
var DB = require('../../../models/models');
//////////////////////////////////////////////////////////////////////////////////////////
//Singleton
module.exports = function(app, UUID, socket, Zones) {
        socket.sockets.on('connection', function(client) {
            client.userid = UUID()
            console.log('Unknown Player Connected: ' + client.userid);
            // client.emit('getUserDataClient', { id: newPlayer.getID(), x: newPlayer.getX(), y: newPlayer.getY(), userEquipt: user.player.equipt, userInventory: user.player.inventory});
            //
            client.on("playerLogin", playerLogin);
            client.on("disconnect", disconnectPlayer);
            client.on("movePlayerServer", movePlayer);
            client.on("getPlayersServer", getPlayers);
            // client.on("useActionPlayerServer", useActionPlayer);
            // client.on("attackActionPlayerServer", attackActionPlayer);
        });

        function playerLogin(data) {
            var client = this
            DB.User.findOne({ 'user.email': data.email }, { 'user.password': 0 }, function(err, user) {
                if (user) {
                    console.log('\r\nPlayer Connected: ' + client.userid);
                        //
                        console.log(user.player.name)
                    var newPlayer = new Player(client.userid, user.player.name);
                    newPlayer.setX(user.player.xCoord)
                    newPlayer.setY(user.player.yCoord)
                    newPlayer.setWorld(user.player.world)
                    console.log('Player Name: ' + newPlayer.getName());
                    console.log('Player Location: ' + newPlayer.getX() + "," + newPlayer.getY());
                    Zones.addPlayer(newPlayer)
					console.log("Player added to Zone: " + newPlayer.getWorld())
                    socket.emit("newPlayerClient", { id: newPlayer.getID(), x: newPlayer.getX(), y: newPlayer.getY() });
                    client.emit("loginResponse", { status: true, player: user.player })
                    console.log("Current Players: " + JSON.stringify(Zones.getPlayers()))
                } else {
                    console.log("Failed To Authenticate User: " + client.userid)
                    client.emit("loginResponse", { status: false })
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
            console.log('Player Disconnected: ' + this.userid);
            var removePlayer = Zones.getPlayerById(this.userid);
            if (!removePlayer) {
                console.log("Disconnect | Player not found: " + this.userid);
                return;
            }
            Zones.removePlayer(removePlayer);
            this.broadcast.emit("removePlayerClient", { id: removePlayer.getID() });
            console.log("Current Players: " + JSON.stringify(Zones.getPlayers()))
        }

        function getPlayers() {
            console.log("Sending Player Data" + this.userid)
            var players = Zones.getPlayers()
            for (var i = 0; i < players.length; i++) {
                this.emit("newPlayerClient", { id: players[i].getID(), x: players[i].getX(), y: players[i].getY() });
            };
        }

        function movePlayer(data) {
            var movePlayer = Zones.getPlayerById(data.id);
            if (!movePlayer) {
                console.log("Move | Player not found: " + data.id);
                return;
            };
            // Update player position
            movePlayer.setX(data.x);
            movePlayer.setY(data.y);
            movePlayer.setDir(data.dir);
            // Broadcast updated position to connected socket clients
            this.broadcast.emit("movePlayerClient", { id: movePlayer.getID(), x: movePlayer.getX(), y: movePlayer.getY(), dir: movePlayer.getDir() });
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////
