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
        });

        function playerLogin(data) {
            var client = this
            DB.User.findOne({ 'user.email': data.email }, function(err, user) {
                if (user && (user.user.password == data.password)) {
                    if (Zones.userIsOnline(user._id.toString())) {
                        client.emit("loginResponse", { status: false, message: "Player Already Logged In!" })
                        return
                    }
                    client.userid = user._id
                    console.log('\r\nAuthenticated Player Connected');
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
            var actionPlayer = Zones.getPlayerById(data.player.id);
            // Player not found
            if (!actionPlayer) {
                console.log("Player not found: " + data.player.id);
                return;
            };
            switch (data.action) {
                case "move":
                    // Update player position
                    actionPlayer.setX(data.player.x);
                    actionPlayer.setY(data.player.y);
                    actionPlayer.setDir(data.player.direction);
                    // Broadcast updated position to connected socket clients
                    this.broadcast.emit("actionPlayerClient", { action: 'move', player: actionPlayer.getSerializedPlayer() });
                    break;
                        case "use":
                          var playerZone = Zones.getZone(data.player.zone)
                                var entityTile = playerZone.getCoordTileAdj(actionPlayer.getX(), actionPlayer.getY(), actionPlayer.getDir())
                                var entity = playerZone.getEntityAt(entityTile.x, entityTile.y)
                                if (!!entity) {
                                    console.log("Result: " + entity.text)
                                }
                            break;
                    //     case "attack":
                    //         console.log("attack")
                    //         break;
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////
