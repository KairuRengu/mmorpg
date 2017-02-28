Player = require("../classes/Player").Player;
World = require("../classes/World").World;
// World = require("../classes/World");
players = [];
//////////////////////////////////////////////////////////////////////////////////////////
module.exports = function(app, UUID, socket) {
        socket.sockets.on('connection', function(client) {
            client.userid = UUID();
            var startX = 32 //Math.round(Math.random() * (500 - 5))
            var startY = 32 //Math.round(Math.random() * (500 - 5));
            //
            var homeWorld = new World();
            console.log("Loading Map: "+homeWorld.getWorldName())
            console.log("Map Size: "+homeWorld.getWorldWidth()+","+homeWorld.getWorldHeight())
            //
            var newPlayer = new Player(client.userid, startX, startY);
            client.emit('getUserDataClient', { id: newPlayer.getID(), x: newPlayer.getX(), y: newPlayer.getY(), userEquipt: ["rock", "none", "none", "none", "none", "none"], userInventory: ["none", "sword", "none", "none", "none", "none", "none", "none"] });
            players.push(newPlayer);
            console.log('Player Connected: ' + client.userid);
            //
            this.emit("newPlayerClient", { id: newPlayer.getID(), x: newPlayer.getX(), y: newPlayer.getY() });
            console.log("Current Players: " + JSON.stringify(players) + "\n")
            setEventHandlers(client);
        });

        function setEventHandlers(client) {
            client.on("disconnect", DisconnectPlayer);
            client.on("movePlayerServer", MovePlayer);
            client.on("getPlayersServer", GetPlayers);
            client.on("useActionPlayerServer", useActionPlayer);
            client.on("attackActionPlayerServer", attackActionPlayer);
        }

        function useActionPlayer(data) {
            var actionPlayer = playerById(data.id);
            if (!actionPlayer) {
                console.log("USE | Player not found: " + data.id);
                return;
            };
            console.log("Player "+data.id+" pressed USE on coord: " + actionPlayer.getX()+","+ actionPlayer.getY() + " facing "+ actionPlayer.getDir())
        }

        function attackActionPlayer(data) {
            var actionPlayer = playerById(data.id);
            if (!actionPlayer) {
                console.log("ATTACK | Player not found: " + data.id);
                return;
            };
            console.log("Player "+data.id+" pressed ATTACK on coord: " + actionPlayer.getX()+","+ actionPlayer.getY() + " facing "+ actionPlayer.getDir())
        }

        function DisconnectPlayer() {
            console.log('Player Disconnected: ' + this.userid);
            var removePlayer = playerById(this.userid);
            if (!removePlayer) {
                console.log("Disconnect | Player not found: " + this.userid);
                return;
            }
            players.splice(players.indexOf(removePlayer), 1);
            this.broadcast.emit("removePlayerClient", { id: removePlayer.getID() });
            console.log("Current Players: " + JSON.stringify(players) + "\n")
        }

        function GetPlayers() {
            console.log("Requesting Data from " + this.userid)
            for (var i = 0; i < players.length; i++) {
                this.emit("newPlayerClient", { id: players[i].getID(), x: players[i].getX(), y: players[i].getY() });
            };
        }

        function MovePlayer(data) {
            // console.log(data.dir)
            var movePlayer = playerById(data.id);
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
function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id) return players[i];
    };
    return false;
};
