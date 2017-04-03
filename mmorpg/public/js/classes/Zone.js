var Zone = function(name, width, height, textureMap, overlayMap, actionMap, entities, defaultEntites) {
    var name = name
    var tileSize = 32
    var textureMap = textureMap
    var overlayMap = overlayMap
    var actionMap = actionMap
    var entities = entities
    var defaultEntites = defaultEntites
    var width = width
    var height = height
        //
    function getName() {
        return name
    };

    function getEntities() {
        return entities
    }

    function moveMobs(tick) {
        var moved = false
        for (var x = entities.length - 1; x >= 0; x--) {
            if (entities[x].type == "mob") {
                var healChance = Math.floor((Math.random() * 10) + 1);
                var moveChance = Math.floor((Math.random() * 3) + 1);
                var movedir = Math.floor((Math.random() * 4) + 1);
                if (healChance == 1 && entities[x].health >= 75) {
                    entities[x].health = 100
                }
                if (healChance == 1 && entities[x].health < 75) {
                    entities[x].health = entities[x].health + 25
                }
                if (moveChance == 1) {
                    if (movedir == 1 && getTileAction(entities[x].x + 1, entities[x].y) == 0) {
                        entities[x].x = entities[x].x + 1
                    }
                    if (movedir == 2 && getTileAction(entities[x].x - 1, entities[x].y) == 0) {
                        entities[x].x = entities[x].x - 1
                    }
                    if (movedir == 3 && getTileAction(entities[x].x, entities[x].y + 1) == 0) {
                        entities[x].y = entities[x].y + 1
                    }
                    if (movedir == 4 && getTileAction(entities[x].x, entities[x].y - 1) == 0) {
                        entities[x].y = entities[x].y - 1
                    }
                    moved = true
                }
            }
        }
        return moved
    }

    function respawnEntities(tick) {
        var updated = false
        for (var i = defaultEntites.length - 1; i >= 0; i--) {
            if (!!entities.regen) {
                continue
            }
            var exists = false
            for (var x = entities.length - 1; x >= 0; x--) {
                if (defaultEntites[i].id == entities[x].id) {
                    exists = true
                }
            }
            //
            if (exists == false) {
                if (defaultEntites[i].regenCount == 0) {
                    entities.push(JSON.parse(JSON.stringify(defaultEntites[i])))
                    defaultEntites[i].regenCount = defaultEntites[i].regen
                    updated = true
                } else {
                    defaultEntites[i].regenCount -= 1;
                }
            }
        }
        return updated
    }

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
            return false
        }
    }
    var getAdjCoord = function(x, y, dir) {
        if (dir == "up") {
            return { x: x, y: y - 1 }
        }
        if (dir == "down") {
            return { x: x, y: y + 1 }
        }
        if (dir == "left") {
            return { x: x - 1, y: y }
        }
        if (dir == "right") {
            return { x: x + 1, y: y }
        }
    }
    var removeEntity = function(ent) {
        for (var i = entities.length - 1; i >= 0; i--) {
            if (entities[i] == ent) {
                entities.splice(i, 1)
            }
        }
    }
    var getAdjEntity = function(x, y, dir) {
        if (dir == "up") {
            return getEntity(x, y - 1)
        }
        if (dir == "down") {
            return getEntity(x, y + 1)
        }
        if (dir == "left") {
            return getEntity(x - 1, y)
        }
        if (dir == "right") {
            return getEntity(x + 1, y)
        }
    }
    return {
        canMove: canMove,
        removeEntity: removeEntity,
        getAdjEntity: getAdjEntity,
        getEntity: getEntity,
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
        respawnEntities: respawnEntities,
        getAdjCoord: getAdjCoord,
        moveMobs: moveMobs
    }
}
try {
    module.exports = Zone
} catch (err) {}
