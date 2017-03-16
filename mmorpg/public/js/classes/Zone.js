var Zone = function(name, width, height, textureMap, actionMap, entities) {
    var name = name
    var tileSize = 32
    var textureMap = textureMap
    var actionMap = actionMap
    var entities = entities
    var width = width
    var height = height
        //
    function getName() {
        return name
    };

    function setActionMap(aMap) {
        actionMap = aMap
    };

    function getSerializedZone() {
        return { name: name, textureMap: textureMap, actionMap: actionMap, entities: entities, width: width, height: height }
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
    var getTileAction = function(col, row) {
        return actionMap[row * width + col];
    }
    var getEntityAt = function(x, y) {
        var entityIndex = actionMap[y * width + x];
        for (var i = entities.length - 1; i >= 0; i--) {
            if (entities[i].index == entityIndex) {
                return entities[i]
            }
        }
        return false
    }
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
        setActionMap: setActionMap,
        getCoordTileAdj: getCoordTileAdj,
        getName: getName,
        getWidth: getWidth,
        getHeight: getHeight,
        getSerializedZone: getSerializedZone,
        getTileSize: getTileSize,
        getTileTexture: getTileTexture,
        getTileAction: getTileAction,
        getEntityAt: getEntityAt
    }
}
try {
    module.exports = Zone
} catch (err) {}
