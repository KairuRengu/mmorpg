var Player = function(id) {
    var name = ""
    var x = 0
    var y = 0
    var direction = "down" //
    var id = id //
    var moveSpeed = 100 //
    var canAction = true //
    var canMove = true //
    var canClickL = true //
    var canClickR = true //
    var equipt = []
    var inventory = []
    var zone = ""
    var health = 100
    var mana = 100
        // Getters and setters
    var getSerializedPlayer = function() {
        var sPlayer = { id: id, name: name, x: x, y: y, zone: zone, health: health, mana: mana, direction: direction }
        return sPlayer
    }
    var setSerializedPlayer = function(sPlayer) {
        id = sPlayer.id
        name = sPlayer.name
        x = sPlayer.x
        y = sPlayer.y
        zone = sPlayer.zone
        health = sPlayer.health
        mana = sPlayer.mana
        direction = sPlayer.direction
        return
    }
    var getHealth = function() {
        return health;
    };
    var setHealth = function(playerHealth) {
        health = playerHealth;
    };
    var getMana = function() {
        return mana;
    };
    var setMana = function(playerMana) {
        mana = playerMana;
    };
    var getName = function() {
        return name;
    };
    var setName = function(playerName) {
        name = playerName;
    };
    var getX = function() {
        return x;
    };
    var getY = function() {
        return y;
    };
    var getID = function() {
        return id;
    };
    var setEquipt = function(array) {
        equipt = array;
    };
    var getEquipt = function() {
        return equipt;
    };
    var setInventory = function(array) {
        inventory = array;
    };
    var getInventory = function() {
        return inventory;
    };
    var getDir = function() {
        return direction;
    };
    var setDir = function(dir) {
        direction = dir;
    };
    var getMoveSpeed = function() {
        return moveSpeed;
    };
    var getCanAction = function() {
        return canAction;
    };
    var setCanAction = function(bool) {
        canAction = bool;
    };
    var getCanClickL = function() {
        return canClickL;
    };
    var setCanClickL = function(bool) {
        canClickL = bool;
    };
    var getCanClickR = function() {
        return canClickR;
    };
    var setCanClickR = function(bool) {
        canClickR = bool;
    };
    var getCanMove = function() {
        return canMove;
    };
    var setCanMove = function(bool) {
        canMove = bool;
    };
    var setX = function(newX) {
        x = newX;
    };
    var setY = function(newY) {
        y = newY;
    };
    var setZone = function(zoneName) {
        zone = zoneName;
    };
    var getZone = function() {
        return zone;
    };
    // Define which variables and methods can be accessed
    return {
        setHealth: setHealth,
        getHealth: getHealth,
        setMana: setMana,
        getMana: getMana,
        getName: getName,
        setName: setName,
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        getID: getID,
        setCanMove: setCanMove,
        getCanMove: getCanMove,
        getMoveSpeed: getMoveSpeed,
        getCanAction: getCanAction,
        setCanAction: setCanAction,
        getCanClickL:getCanClickL,
        setCanClickL:setCanClickL,
        getCanClickR:getCanClickR,
        setCanClickR:setCanClickR,
        getDir: getDir,
        setDir: setDir,
        setEquipt: setEquipt,
        getEquipt: getEquipt,
        setInventory: setInventory,
        getInventory: getInventory,
        setZone: setZone,
        getZone: getZone,
        getSerializedPlayer: getSerializedPlayer,
        setSerializedPlayer: setSerializedPlayer
    }
};
try {
    exports.Player = Player;
} catch (err) {}
