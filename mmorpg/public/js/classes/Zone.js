var Zone = function(name, width, height, textureMap, overlayMap, actionMap) {
    var name = name
    var tileSize = 32
    var textureMap = textureMap
    var overlayMap = overlayMap
    var actionMap = actionMap
    var entities = []
    var width = width
    var height = height
        //
    function getName() {
        return name
    };

    function setEntity(index, x, y) {
        actionMap[y * width + x] = index
    };

    function getSerializedZone() {
        return { name: name, textureMap: textureMap, actionMap: actionMap, overlayMap: overlayMap, width: width, height: height }
    };

    function setSerializedZone(sZone) {
        name = sZone.name
        textureMap = sZone.textureMap
        actionMap = sZone.actionMap
        overlayMap = sZone.overlayMap
        width = sZone.width
        height = sZone.height
    };
    var getWidth = function() {
        return width;
    };
    var getHeight = function() {
        return height;
    };
    var getTileSize = function() {
        return tileSize;
    };
    var getTileTexture = function(col, row) {
        return textureMap[row * width + col];
    }
    var getTileOverlay = function(col, row) {
        return overlayMap[row * width + col];
    }
    var getTileAction = function(col, row) {
        return actionMap[row * width + col];
    }
    var canMove = function(x, y, dir) {
            if (dir == "up" && getTileAction(x, y - 1) != 0) {
                return true
            }
            if (dir == "down" && getTileAction(x, y + 1) != 0) {
                return true
            }
            if (dir == "left" && getTileAction(x - 1, y) != 0) {
                return true
            }
            if (dir == "right" && getTileAction(x + 1, y) != 0) {
                return true
            }
            return false
        }
        // var getEntityAt = function(x, y) {
        //     var entityIndex = actionMap[y * width + x];
        //     for (var i = entities.length - 1; i >= 0; i--) {
        //         if (entities[i].index == entityIndex) {
        //             return entities[i]
        //         }
        //     }
        //     return false
        // }
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
    return {
        canMove: canMove,
        // setEntity: setEntity,
        getTileOverlay: getTileOverlay,
        getCoordTileAdj: getCoordTileAdj,
        getName: getName,
        getWidth: getWidth,
        getHeight: getHeight,
        getSerializedZone: getSerializedZone,
        setSerializedZone: setSerializedZone,
        getTileSize: getTileSize,
        getTileTexture: getTileTexture,
        getTileAction: getTileAction,
        // getEntityAt: getEntityAt
    }
}
try {
    module.exports = Zone
} catch (err) {}
