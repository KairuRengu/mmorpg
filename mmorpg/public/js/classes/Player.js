var Player = function(id) {
    var x = 0
    var y = 0
    var direction = "down"
    var id = id
    var moveSpeed = 100
    var canAction = true
    var canMove = true
    var equipt = []
    var inventory = []
        // Getters and setters
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
    // Define which variables and methods can be accessed
    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id,
        getID: getID,
        setCanMove: setCanMove,
        getCanMove: getCanMove,
        getMoveSpeed: getMoveSpeed,
        getCanAction: getCanAction,
        setCanAction: setCanAction,
        getDir: getDir,
        setDir: setDir,
        setEquipt: setEquipt,
        getEquipt: getEquipt,
        setInventory: setInventory,
        getInventory: getInventory
    }
};
try {
    exports.Player = Player;
} catch (err) {}
