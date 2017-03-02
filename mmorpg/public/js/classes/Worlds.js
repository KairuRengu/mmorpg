var Worlds = function() {
    var map = []
    var getTile = function(layer, col, row) {
        if (layer == 0) {
            return map.textureLayer[row * map.worldWidth + col];
        }
        if (layer == 1) {
            return map.actionLayer[row * map.worldWidth + col];
        }
    }
    var getCoordTileAdj = function(x, y, dir) {
        if (dir == "up") {
            return { y: (y - 1), x: x };
        }
        if (dir == "down") {
            return { y: (y + 1), x: x };
        }
        if (dir == "left") {
            return { y: y, x: (x - 1) };
        }
        if (dir == "right") {
            return { y: y, x: (x + 1) };
        }
    }
    var getEntityAt = function(x, y) {
        var entityIndex = map.actionLayer[y * map.worldWidth + x];
        for (var i = map.entities.length - 1; i >= 0; i--) {
            if (map.entities[i].index == entityIndex) {
                return map.entities[i]
            }
        }
        // return {canMove:true}
    }
    var addWorld = function(worldData) {
        map.push(worldData)
    }
    var getEntities = function() {
        return map.entities;
    }
    var getTileSize = function() {
        return map.tileSize;
    };
    var getWorldName = function() {
        return map.worldName;
    };
    var getWorldWidth = function() {
        return map.worldWidth;
    };
    var getWorldHeight = function() {
        return map.worldHeight;
    };
    //
    var getWorldPlayers = function() {
        return players;
    };
    var getWorldPlayersCount = function() {
        return players.length;
    };
    var addWorldPlayer = function(player) {
        for (var i = map.length - 1; i >= 0; i--) {
            if (map[i].worldName == player.getWorld()){
              map[i].players.push(player);   
            }
            
        }
       
    };
    var removeWorldPlayer = function(player) {
        players.splice(players.indexOf(player), 1);
    };
    var getPlayerById = function(id) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == id) return players[i];
        };
        return false;
    };
    // Define which variables and methods can be accessed
    return {
        getTileSize: getTileSize,
        getTile: getTile,
        getWorldWidth: getWorldWidth,
        getWorldHeight: getWorldHeight,
        getWorldName: getWorldName,
        // getWorldPlayers: getWorldPlayers,
        addWorldPlayer: addWorldPlayer,
        // removeWorldPlayer: removeWorldPlayer,
        // getWorldPlayersCount: getWorldPlayersCount,
        // getPlayerById: getPlayerById,
        getCoordTileAdj: getCoordTileAdj,
        getEntityAt: getEntityAt,
        getEntities: getEntities,
        addWorld: addWorld,
        map:map
    }
};
try {
    exports.Worlds = Worlds;
} catch (err) {}
