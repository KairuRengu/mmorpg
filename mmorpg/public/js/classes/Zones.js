var Zones = function() {
    var zones = []
    var players = []
        //
    function getZones() {
        return zones
    };

    function addZone(zone) {
        zones.push(zone)
        return
    };

    function getPlayers() {
        return players
    };
    var addPlayer = function(player) {
        players.push(player);
    };
    var removePlayer = function(player) {
        players.splice(players.indexOf(player), 1);
    };
    var getPlayerById = function(id) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].getID() == id) return players[i];
        };
        return false;
    };
    return {
        getZones: getZones,
        addZone: addZone,
        addPlayer: addPlayer,
        getPlayers: getPlayers,
        removePlayer: removePlayer,
        getPlayerById: getPlayerById
    }
}
try {
    module.exports = Zones
} catch (err) {}
