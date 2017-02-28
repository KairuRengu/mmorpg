/**************************************************
 ** GAME PLAYER CLASS
 **************************************************/
char = new Image();
char.src = "../assets/character.png";
var Player = function(id, startX, startY) {
    var x = startX
    var y = startY
    var direction = "down"
    var id = id
    var moveSpeed = 2
    var attackSpeed = 100
    var canAction = true
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
    var getAttackSpeed = function() {
        return attackSpeed;
    };
    var getCanAction = function() {
        return canAction;
    };
    var setCanAction = function(bool) {
        canAction = bool;
    };
    var setX = function(newX) {
        x = newX;
    };
    var setY = function(newY) {
        y = newY;
    };
    // Update player position
    // Draw player
    var draw = function(ctx) {
        ctx.fillText(id, x - 5, y - 5);
        switch (direction) {
            // Controls
            case "down":
                ctx.drawImage(char, 0, 0, 32, 32, x, y, 32, 32);
                if (!canAction) {
                    ctx.drawImage(actions, 0, 0, 32, 32, localPlayer.getX(), localPlayer.getY() + 32, 32, 32);
                }
                break;
            case "up":
                ctx.drawImage(char, 32, 0, 32, 32, x, y, 32, 32);
                if (!canAction) {
                    ctx.drawImage(actions, 0, 0, 32, 32, localPlayer.getX(), localPlayer.getY() - 32, 32, 32);
                }
                break;
            case "left":
                ctx.drawImage(char, 64, 0, 32, 32, x, y, 32, 32);
                if (!canAction) {
                    ctx.drawImage(actions, 0, 0, 32, 32, localPlayer.getX() - 32, localPlayer.getY(), 32, 32);
                }
                break;
            case "right":
                ctx.drawImage(char, 96, 0, 32, 32, x, y, 32, 32);
                if (!canAction) {
                    ctx.drawImage(actions, 0, 0, 32, 32, localPlayer.getX() + 32, localPlayer.getY(), 32, 32);
                }
                break;
        };
        // ctx.drawImage(char, x, y);
    };
    // Define which variables and methods can be accessed
    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        update: update,
        draw: draw,
        id: id,
        getID: getID,
        getMoveSpeed: getMoveSpeed,
        getAttackSpeed: getAttackSpeed,
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
try{
exports.Player = Player;
}
catch(err){

}