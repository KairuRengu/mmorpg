var Zone = function(name, width, height, textureMap, overlayMap, actionMap, entities) {
    var name = name
    var tileSize = 32
    var textureMap = textureMap
    var overlayMap = overlayMap
    var actionMap = actionMap
    var entities = entities
    var width = width
    var height = height
        //
    function getName() {
        return name
    };

    function getEntities() {
        return entities
    }
    // function loadEntities(pEntities) {
    //     entities = pEntities
    // };
    // function setEntity(index, x, y) {
    //     actionMap[y * width + x] = index
    // };
    function getSerializedZone() {
        return { name: name, textureMap: textureMap, actionMap: actionMap, overlayMap: overlayMap, width: width, height: height, entities: entities }
    };

    function setSerializedZone(sZone) {
        name = sZone.name
        textureMap = sZone.textureMap
        actionMap = sZone.actionMap
        overlayMap = sZone.overlayMap
        entities = sZone.entities
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
    var getEntity = function(x, y) {
        for (var i = entities.length - 1; i >= 0; i--) {
            if (entities[i].x == x && entities[i].y == y) {
                return entities[i]
            }
        }
        return false
    }
    var canMove = function(x, y, dir) {
            if (dir == "up" && getTileAction(x, y - 1) == 0) {
                if (!getEntity(x, y - 1) || getEntity(x, y - 1).canWalk == true) {
                    return true
                }
            }
            if (dir == "down" && getTileAction(x, y + 1) == 0) {
                if (!getEntity(x, y + 1) || getEntity(x, y + 1).canWalk == true) {
                    return true
                }
            }
            if (dir == "left" && getTileAction(x - 1, y) == 0) {
                if (!getEntity(x - 1, y) || getEntity(x - 1, y).canWalk == true) {
                    return true
                }
            }
            if (dir == "right" && getTileAction(x + 1, y) == 0) {
                if (!getEntity(x + 1, y) || getEntity(x + 1, y).canWalk == true) {
                    return true
                }
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
        // var getCoordTileAdj = function(x, y, dir) {
        //     if (dir == "up") {
        //         return { y: (y - 1), x: x };
        //     }
        //     if (dir == "down") {
        //         return { y: (y + 1), x: x };
        //     }
        //     if (dir == "left") {
        //         return { y: y, x: (x - 1) };
        //     }
        //     if (dir == "right") {
        //         return { y: y, x: (x + 1) };
        //     }
        // }
    return {
        canMove: canMove,
        // loadEntities: loadEntities,
        // setEntity: setEntity,
        // getCoordTileAdj: getCoordTileAdj,
        getEntities: getEntities,
        getName: getName,
        getTileSize: getTileSize,
        getWidth: getWidth,
        getHeight: getHeight,
        getSerializedZone: getSerializedZone,
        setSerializedZone: setSerializedZone,
        getTileOverlay: getTileOverlay,
        getTileTexture: getTileTexture,
        getTileAction: getTileAction,
        // getEntityAt: getEntityAt
    }
}
try {
    module.exports = Zone
} catch (err) {}
