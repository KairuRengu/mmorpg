var Zones = function() {
    var zones = []
    var players = []
        //
    function getZones() {
        return zones
    };
        function getZone(zoneName) {
         for (var i = 0; i < zones.length; i++) {
            if (zones[i].getName() == zoneName) return zones[i];
        };
        return false;
    };

    function addZone(zone) {
        zones.push(zone)
        return
    };
    function userIsOnline(id){
        for (var i = players.length - 1; i >= 0; i--) {
            if(id == players[i].getID()){
                return true
            }
        }
        return false
    }
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
        userIsOnline:userIsOnline,
        getZone:getZone,
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
