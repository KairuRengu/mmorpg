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
        return { canMove: true }
    }
    return {
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