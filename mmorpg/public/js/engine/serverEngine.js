Player = require("../classes/Player").Player;
var DB = require('../../../models/models');
var updateTicker = 0
    //////////////////////////////////////////////////////////////////////////////////////////
    //Singleton
module.exports = function(app, socket, Zones) {
        tickUpdater()
        setInterval(function() { tickUpdater() }, 1000);
        socket.sockets.on('connection', function(client) {
            console.log('Unknown Player Connected');
            client.on("login", playerLogin);
            client.on("disconnect", disconnectPlayer);
            client.on("getPlayersServer", getPlayerList);
            client.on("actionPlayerServer", actionPlayer);
        });

        function tickUpdater() {
            // console.log("Tick: " + updateTicker)
            for (var zonesIndex = Zones.getZones().length - 1; zonesIndex >= 0; zonesIndex--) {
                var updated = Zones.getZones()[zonesIndex].respawnEntities(updateTicker)
                var moved = Zones.getZones()[zonesIndex].moveMobs(updateTicker)
                if (updated == true || moved == true) {
                    socket.emit("updateZoneClient", { zone: Zones.getZones()[zonesIndex].getSerializedZone() });
                }
            }
            updateTicker += 1
        }

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
                    client.emit("loginResponse", { status: true, id: newPlayer.getID(), player: user.player, zone: Zones.getZone(newPlayer.getZone()).getSerializedZone() })
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

        function getPlayerList() {
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
                    actionPlayer.setX(data.player.x);
                    actionPlayer.setY(data.player.y);
                    actionPlayer.setDir(data.player.direction);
                    var zoneEntity = Zones.getZone(actionPlayer.getZone()).getEntity(actionPlayer.getX(), actionPlayer.getY())
                    if (zoneEntity && zoneEntity.type == "zoneChange") {
                        actionPlayer.setX(zoneEntity.x2);
                        actionPlayer.setY(zoneEntity.y2);
                        actionPlayer.setZone(zoneEntity.zone);
                        // console.log(Zones.getZone(zoneEntity.zone).getSerializedZone())
                        this.emit("actionPlayerClient", { action: 'zoneChange', player: actionPlayer.getSerializedPlayer(), zone: Zones.getZone(zoneEntity.zone).getSerializedZone() });
                    }
                    this.broadcast.emit("updatePlayersClient", { player: actionPlayer.getSerializedPlayer() });
                    break;
                case "use":
                    var Xsum = (data.player.x - data.pointX)
                    var Ysum = (data.player.y - data.pointY)
                    var coordDistance = Math.floor(Math.sqrt(Xsum * Xsum + Ysum * Ysum))
                        //
                    var playerZone = Zones.getZone(actionPlayer.getZone())
                    var entity = playerZone.getEntity(data.pointX, data.pointY)
                    if (entity && entity.canUse && coordDistance == 1) {
                        this.emit("actionPlayerClient", { action: 'use', success: true, entity: entity.name })
                        playerZone.removeEntity(entity)
                        socket.emit("updateZoneClient", { zone: playerZone.getSerializedZone() });
                    } else {
                        this.emit("actionPlayerClient", { action: 'use', success: false })
                    }
                    break;
                case "attack":
                    var Xsum = (data.player.x - data.pointX)
                    var Ysum = (data.player.y - data.pointY)
                    var coordDistance = Math.floor(Math.sqrt(Xsum * Xsum + Ysum * Ysum))
                        //
                    var playerZone = Zones.getZone(actionPlayer.getZone())
                    var entity = playerZone.getEntity(data.pointX, data.pointY)
                    if (entity && entity.canAttack && coordDistance == 1) {
                        //
                        if (entity.name == "Grass") {
                            entity.health -= 50
                        } else {
                            entity.health -= 25
                        }
                        //
                        if (entity.health <= 0) {
                            playerZone.removeEntity(entity)
                            this.emit("actionPlayerClient", { action: 'kill', success: true, entity: entity.name })
                            socket.emit("updateZoneClient", { zone: playerZone.getSerializedZone() });
                        } else {
                            this.emit("actionPlayerClient", { action: 'attack', success: true, entity: entity.name })
                            socket.emit("updateZoneClient", { zone: playerZone.getSerializedZone() });
                        }
                    } else {
                        this.emit("actionPlayerClient", { action: 'attack', success: false })
                    }
                    break;
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////
