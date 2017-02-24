/**************************************************
 ** GAME PLAYER CLASS
 **************************************************/
char = new Image();
char.src = "../assets/character.png";
var Player = function(id, startX, startY) {
    var x = startX,
        y = startY,
        id = id,
        moveSpeed = 16;
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
        var getMoveSpeed = function() {
        return moveSpeed;
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
        ctx.drawImage(char, x, y);
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
        getMoveSpeed:getMoveSpeed
    }
};
