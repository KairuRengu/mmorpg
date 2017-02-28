Player = require("../classes/Player").Player;
//////////////////////////////////////////////////////////////////////////////////////////
module.exports = function(app, UUID, socket, World) {
        socket.sockets.on('connection', function(client) {
            client.userid = UUID();
            var startX = 32 //Math.round(Math.random() * (500 - 5))
            var startY = 32 //Math.round(Math.random() * (500 - 5));
                //
            var newPlayer = new Player(client.userid, startX, startY);
            client.emit('getUserDataClient', { id: newPlayer.getID(), x: newPlayer.getX(), y: newPlayer.getY(), userEquipt: ["rock", "none", "none", "none", "none", "none"], userInventory: ["none", "sword", "none", "none", "none", "none", "none", "none"] });
            World.addWorldPlayer(newPlayer);
            console.log('\r\nPlayer Connected: ' + client.userid);
            console.log("Loading Map: " + World.getWorldName() + ", Size: " + World.getWorldWidth() + "," + World.getWorldHeight())
                //
            this.emit("newPlayerClient", { id: newPlayer.getID(), x: newPlayer.getX(), y: newPlayer.getY() });
            setEventHandlers(client);
            console.log("Current Players: " + JSON.stringify(World.getWorldPlayers() + "\r\n"))
        });

        function setEventHandlers(client) {
            client.on("disconnect", DisconnectPlayer);
            client.on("movePlayerServer", MovePlayer);
            client.on("getPlayersServer", GetPlayers);
            client.on("useActionPlayerServer", useActionPlayer);
            client.on("attackActionPlayerServer", attackActionPlayer);
        }

        function useActionPlayer(data) {
            var actionPlayer = World.getPlayerById(data.id);
            if (!actionPlayer) {
                console.log("USE | Player not found: " + data.id);
                return;
            };
            console.log("Player " + data.id + " pressed USE on coord: " + actionPlayer.getX() + "," + actionPlayer.getY() + " facing " + actionPlayer.getDir())
        }

        function attackActionPlayer(data) {
            var actionPlayer = World.getPlayerById(data.id);
            if (!actionPlayer) {
                console.log("ATTACK | Player not found: " + data.id);
                return;
            };
            console.log("Player " + data.id + " pressed ATTACK on coord: " + actionPlayer.getX() + "," + actionPlayer.getY() + " facing " + actionPlayer.getDir())
        }

        function DisconnectPlayer() {
            console.log('Player Disconnected: ' + this.userid);
            var removePlayer = World.getPlayerById(this.userid);
            if (!removePlayer) {
                console.log("Disconnect | Player not found: " + this.userid);
                return;
            }
            World.removeWorldPlayer(removePlayer);
            // players.splice(players.indexOf(removePlayer), 1);
            this.broadcast.emit("removePlayerClient", { id: removePlayer.getID() });
            console.log("Current Players: " + JSON.stringify(World.getWorldPlayers() + "\r\n"))
        }

        function GetPlayers() {
            console.log("Sending Player Data" + this.userid)
            var players = World.getWorldPlayers()
            for (var i = 0; i < players.length; i++) {
                this.emit("newPlayerClient", { id: players[i].getID(), x: players[i].getX(), y: players[i].getY() });
            };
        }

        function MovePlayer(data) {
            // console.log(data.dir)
            var movePlayer = World.getPlayerById(data.id);
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
