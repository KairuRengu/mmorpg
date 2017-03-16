var Zone = function(name, width, height, textureMap) {
    var name = name
    var tileSize = 32
    var textureMap = textureMap
    var width = width
    var height = height
        //
    function getName() {
        return name
    };
    return {
        getName: getName
    }
}
try {
    module.exports = Zone
} catch (err) {}
