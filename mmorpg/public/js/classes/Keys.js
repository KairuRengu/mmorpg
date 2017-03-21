/**************************************************
 ** GAME KEYBOARD CLASS
 **************************************************/
var Keys = function(up, left, right, down, z, use, mouseLeft, mouseRight) {
    var up = up || false
    var left = left || false
    var right = right || false
    var down = down || false
    var z = z || false
    var use = use || false
    var mouseLeft = mouseLeft || false
    var mouseRight = mouseRight || false
    var onMouseDown = function(e) {
        var that = this
        e.preventDefault();
        if (e.target.id != "gameCanvas") {
            return
        }
        switch (e.buttons) {
            // Controls
            case 1: // Left
                that.mouseLeft = true;
                // console.log("Left Down")
                break;
            case 2: // Right
                that.mouseRight = true;
                // console.log("Right Down")
                break;
            case 3: // Both
                that.mouseLeft = true;
                that.mouseRight = true;
                // console.log("Both Down")
                break;
        };
    }
    var onMouseUp = function(e) {
        var that = this
        e.preventDefault();
        if (e.target.id != "gameCanvas") {
            return
        }
        console.log(" X: " + e.layerX + " " + "Y: " + e.layerY)
        switch (e.buttons) {
            // Controls
            case 2: // Left
                that.mouseLeft = false;
                // console.log("Left Up")
                break;
            case 1: // Right
                that.mouseRight = false;
                // console.log("Right Up")
                break;
            case 0: // Both
                that.mouseLeft = false;
                that.mouseRight = false;
                // console.log("Both Up")
                break;
        };
    }
    var onKeyDown = function(e) {
        var that = this
        e.preventDefault();
        switch (e.keyCode) {
            // Controls
            case 65: // Left
                that.left = true;
                break;
            case 87: // Up 38
                that.up = true;
                break;
            case 68: // Right
                that.right = true;
                break;
            case 83: // Down
                that.down = true;
                break;
            case 90: // Z
                that.z = true;
                break;
            case 69: // E
                that.use = true;
                break;
        };
    };
    var onKeyUp = function(e) {
        var that = this
        switch (e.keyCode) {
            case 65: // Left
                that.left = false;
                break;
            case 87: // Up
                that.up = false;
                break;
            case 68: // Right
                that.right = false;
                break;
            case 83: // Down
                that.down = false;
                break;
            case 90: // Z
                that.z = false;
                break;
            case 69: // E
                that.use = false;
                break;
        };
    };
    return {
        up: up,
        left: left,
        right: right,
        down: down,
        z: z,
        use: use,
        mouseRight: mouseRight,
        mouseLeft: mouseLeft,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        onMouseUp: onMouseUp,
        onMouseDown: onMouseDown
    };
};
