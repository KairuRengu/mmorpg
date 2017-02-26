/**************************************************
 ** GAME KEYBOARD CLASS
 **************************************************/
var Keys = function(up, left, right, down, z, x) {
    var up = up || false,
        left = left || false,
        right = right || false,
        down = down || false,
        z = z || false,
        x = x || false;
    var onKeyDown = function(e) {
        var that = this
            // c = e.keyCode;
        switch (e.keyCode) {
            // Controls
            case 37: // Left
                that.left = true;
                break;
            case 38: // Up 38
                that.up = true;
                break;
            case 39: // Right
                that.right = true; // Will take priority over the left key
                break;
            case 40: // Down
                that.down = true;
                break;
            case 90: // Z
                that.z = true;
                break;
            case 88: // C
                that.x = true;
                break;
        };
    };
    var onKeyUp = function(e) {
        var that = this
            // c = e.keyCode;
        switch (e.keyCode) {
            case 37: // Left
                that.left = false;
                break;
            case 38: // Up
                that.up = false;
                break;
            case 39: // Right
                that.right = false;
                break;
            case 40: // Down
                that.down = false;
                break;
            case 90: // Z
                that.z = false;
                break;
            case 88: // X
                that.x = false;
                break;
        };
    };
    return {
        up: up,
        left: left,
        right: right,
        down: down,
        z: z,
        x: x,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp
    };
};
