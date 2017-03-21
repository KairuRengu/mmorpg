   var canvas; // Canvas DOM element
   var ctx; // Canvas rendering context
   var keys; // Keyboard input
   var zone; //world class
   var localPlayer; // Local player
   var remotePlayers; // Remote players
   var socket; // Socket connection
   var playerList;
   var consoleList;
   var equiptTable;
   var inventoryTable;
   tiles = new Image();
   tiles.src = "../assets/tiles.png";
   overlays = new Image();
   overlays.src = "../assets/overlays.png";
   entities = new Image();
   entities.src = "../assets/entities.png";
   actions = new Image();
   actions.src = "../assets/actions.png";
   window.requestAnimFrame = (function() {
       return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function( /* function */ callback, /* DOMElement */ element) {
           window.setTimeout(callback, 1000 / 60);
       };
   })();

   function init(data) {
       console.log("Starting Engine")
       playerList = document.getElementById("playerList");
       consoleList = document.getElementById("consoleList");
       equiptTable = document.getElementById("equiptTable");
       inventoryTable = document.getElementById("inventoryTable");
       canvas = document.getElementById("gameCanvas");
       ctx = canvas.getContext("2d");
       ctx.imageSmoothingEnabled = false;
       canvas.width = 512;
       canvas.height = 512;
       keys = new Keys();
       remotePlayers = [];
       localPlayer = [];
       ctx.font = "70px Arial";
       ctx.fillText("Loading Jankscape", 50, 50);
       ctx.font = "20px Arial";
       loadPlayerData(data)
       socket.emit("getPlayersServer");
       setEventHandlers();
   }
   //////////////////////////////////////////////////////////////////////////////////////
   function setEventHandlers() {
       window.addEventListener("keydown", onKeydown, false);
       window.addEventListener("keyup", onKeyup, false);
       window.addEventListener("mousedown", onMousedown, false);
       window.addEventListener("mouseup", onMouseup, false);
       socket.on("newPlayerClient", newPlayer);
       socket.on("actionPlayersClient", actionPlayers);
       socket.on("actionPlayerClient", actionPlayer);
       socket.on("removePlayerClient", removePlayer);
       socket.on("updateZoneClient",updateZone);
       socket.on("disconnect", disconnectPlayer);
   }
   // Keyboard key down
   function onKeydown(e) {
       if (localPlayer) {
           keys.onKeyDown(e);
       };
   };
   // Keyboard key up
   function onKeyup(e) {
       if (localPlayer) {
           keys.onKeyUp(e);
       };
   };
   // Keyboard key down
   function onMousedown(e) {
       if (localPlayer) {
           keys.onMouseDown(e);
       };
   };
   // Keyboard key up
   function onMouseup(e) {
       if (localPlayer) {
           keys.onMouseUp(e);
       };
   };

   function disconnectPlayer(data) {
       console.log('User Disconnected');
       window.location.href = './';
   }

   function loadPlayerData(data) {
       localPlayer = new Player(data.id);
       localPlayer.setName(data.player.name)
       localPlayer.setX(data.player.xCoord)
       localPlayer.setY(data.player.yCoord)
       localPlayer.setZone(data.player.zone)
       localPlayer.setHealth(data.player.health)
       localPlayer.setMana(data.player.mana)
       localPlayer.setEquipt(data.player.equipt)
       localPlayer.setInventory(data.player.inventory)
       console.log("----------------------------------------------")
       console.log('ID:  ' + localPlayer.getID());
       console.log('Name:  ' + localPlayer.getName());
       console.log('Zone:  ' + localPlayer.getZone());
       console.log('X:  ' + localPlayer.getX());
       console.log('Y:  ' + localPlayer.getY());
       console.log('Equipt:  ' + localPlayer.getEquipt());
       console.log('Inventory:  ' + localPlayer.getInventory());
       console.log('Health:  ' + localPlayer.getHealth());
       console.log('Mana:  ' + localPlayer.getMana());
       console.log("----------------------------------------------")
           //
       zone = new Zone(data.zone.name, data.zone.width, data.zone.height, data.zone.textureMap, data.zone.overlayMap, data.zone.actionMap, data.zone.entities)
           //
       var item = document.createElement('li');
       item.appendChild(document.createTextNode(localPlayer.getName() + " - " + localPlayer.getID()));
       playerList.appendChild(item);
       //
       var slots = ["Hand", "Head", "Body", "Legs", "Amulet", "Misc"]
       var row = equiptTable.insertRow(0);
       var rowName = equiptTable.insertRow(1);
       for (var i = 0; i <= localPlayer.getEquipt().length - 1; i++) {
           row.insertCell(i).innerHTML = '<img src="./assets/items/' + localPlayer.getEquipt()[i] + '.png">';
           rowName.insertCell(i).innerHTML = slots[i];
       }
       var row = inventoryTable.insertRow(0);
       for (var i = 0; i <= localPlayer.getInventory().length - 1; i++) {
           row.insertCell(i).innerHTML = '<img src="./assets/items/' + localPlayer.getInventory()[i] + '.png">';
       }
       animate();
   };

   function newPlayer(data) {
       // Add new player to the remote players array
       var newPlayer = new Player(data.id);
       newPlayer.setSerializedPlayer(data)
       if (localPlayer.getID() != newPlayer.getID()) {
           console.log("Player connected: " + newPlayer.getID());
           remotePlayers.push(newPlayer);
           var item = document.createElement('li');
           item.appendChild(document.createTextNode(newPlayer.getName() + " - " + newPlayer.getID()));
           playerList.appendChild(item);
           consoleText(newPlayer.getID() + " Joined The Server")
       }
   };

   function actionPlayers(data) {
       var actionPlayer = getPlayerById(data.player.id);
       if (!actionPlayer) {
           console.log("Player not found: " + data.player.id);
           return;
       };
       actionPlayer.setSerializedPlayer(data.player);
   };
   function updateZone(data){
    if (data.zone.name == localPlayer.getZone()){
      zone.setSerializedZone(data.zone)
    }
    // console.log(data.zone.name)
   }

   function actionPlayer(data) {
       switch (data.action) {
           case "zoneChange":
               localPlayer.setSerializedPlayer(data.player)
               zone.setSerializedZone(data.zone);
               break;
           case "consoleText":
               consoleText(data.text)
               break
       }
   };

   function removePlayer(data) {
       console.log("Player Left: " + data.id);
       var lis = playerList.getElementsByTagName("li");
       for (var i = lis.length - 1; i >= 0; i--) {
           if (lis[i].textContent.includes(' - ' + data.id)) {
               lis[i].remove()
           }
       }
       var removePlayer = getPlayerById(data.id);
       // Player not found
       if (!removePlayer) {
           console.log("Player not found: " + data.id);
           return;
       };
       // Remove player from array
       consoleText(data.id + " Left The Server")
       remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
   };

   function consoleText(text) {
       var item = document.createElement('li');
       item.appendChild(document.createTextNode(text));
       consoleList.appendChild(item);
   }
   /**************************************************
    ** GAME ANIMATION LOOP
    **************************************************/
   function animate() {
       update();
       draw();
       window.requestAnimFrame(animate);
   };
   /**************************************************
    ** GAME UPDATE
    **************************************************/
   //
   function move(dir) {
       localPlayer.setDir(dir)
       switch (dir) {
           case "left":
               if (zone.canMove(localPlayer.getX(), localPlayer.getY(), localPlayer.getDir()) && localPlayer.getCanMove()) {
                   var newX = localPlayer.getX()
                   localPlayer.setCanMove(false);
                   newX -= 1
                   localPlayer.setX(newX)
                   setTimeout(function() { moveReset() }, localPlayer.getMoveSpeed());
               }
               return
               break;
           case "right":
               if (zone.canMove(localPlayer.getX(), localPlayer.getY(), localPlayer.getDir()) && localPlayer.getCanMove()) {
                   var newX = localPlayer.getX()
                   localPlayer.setCanMove(false);
                   newX += 1
                   localPlayer.setX(newX)
                   setTimeout(function() { moveReset() }, localPlayer.getMoveSpeed());
               }
               return
               break;
           case "up":
               if (zone.canMove(localPlayer.getX(), localPlayer.getY(), localPlayer.getDir()) && localPlayer.getCanMove()) {
                   var newY = localPlayer.getY()
                   localPlayer.setCanMove(false);
                   newY -= 1
                   localPlayer.setY(newY)
                   setTimeout(function() { moveReset() }, localPlayer.getMoveSpeed());
               }
               return
               break;
           case "down":
               if (zone.canMove(localPlayer.getX(), localPlayer.getY(), localPlayer.getDir()) && localPlayer.getCanMove()) {
                   var newY = localPlayer.getY()
                   localPlayer.setCanMove(false);
                   newY += 1
                   localPlayer.setY(newY)
                   setTimeout(function() { moveReset() }, localPlayer.getMoveSpeed());
               }
               break;
       }
   }

   function actionReset() {
       localPlayer.setCanAction(true);
   }

   function moveReset() {
       localPlayer.setCanMove(true);
   }

   function update() {
       var prevX = localPlayer.getX();
       var prevY = localPlayer.getY();
       var prevDir = localPlayer.getDir();
       //
       if (keys.up & !keys.down) {
           move("up")
       }
       if (!keys.up & keys.down) {
           move("down")
       }
       //
       if (keys.left & !keys.right) {
           move("left")
       }
       if (!keys.left & keys.right) {
           move("right")
       };
       if ((prevX != localPlayer.getX() || prevY != localPlayer.getY() || prevDir != localPlayer.getDir())) {
           socket.emit("actionPlayerServer", { action: 'move', player: localPlayer.getSerializedPlayer() });
       };
       if (keys.mouseLeft) {
           if (localPlayer.getCanAction()) {
               socket.emit("actionPlayerServer", { action: 'attack', player: localPlayer.getSerializedPlayer() });
               localPlayer.setCanAction(false);
               setTimeout(function() { actionReset() }, 300);
           }
       };
       if (keys.use) {
           if (localPlayer.getCanAction()) {
               socket.emit("actionPlayerServer", { action: 'use', player: localPlayer.getSerializedPlayer() });
               localPlayer.setCanAction(false);
               setTimeout(function() { actionReset() }, 300);
           }
       };
   };
   /**************************************************
    ** GAME DRAW
    **************************************************/
   function draw() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       //
       var xCoord = localPlayer.getX()
       var yCoord = localPlayer.getY()
           //Draw Textures
       for (var x = 0; x < zone.getWidth(); x++) {
           for (var y = 0; y < zone.getHeight(); y++) {
               ctx.drawImage(tiles, zone.getTileTexture(x, y) * zone.getTileSize(), 0, zone.getTileSize(), zone.getTileSize(), x * zone.getTileSize(), y * zone.getTileSize(), zone.getTileSize(), zone.getTileSize());
           }
       }
       //Draw Overlays
       for (var x = 0; x < zone.getWidth(); x++) {
           for (var y = 0; y < zone.getHeight(); y++) {
               ctx.drawImage(overlays, zone.getTileOverlay(x, y) * zone.getTileSize(), 0, zone.getTileSize(), zone.getTileSize(), x * zone.getTileSize(), y * zone.getTileSize(), zone.getTileSize(), zone.getTileSize());
           }
       }
       //Draw Entities
       var entity = zone.getEntities()
       for (var i = entity.length - 1; i >= 0; i--) {
           if (entity[i].visible == true) {
               ctx.drawImage(entities, entity[i].tile * zone.getTileSize(), 0, zone.getTileSize(), zone.getTileSize(), entity[i].x * zone.getTileSize(), entity[i].y * zone.getTileSize(), zone.getTileSize(), zone.getTileSize());
           }
       }
       //CAMERA.
       ctx.setTransform(1, 0, 0, 1, 0, 0);
       var camx = (32 * xCoord - ((canvas.width) / 2))
       var camy = (32 * yCoord - ((canvas.height) / 2))
       var endBoundX = (zone.getWidth() * 32) - canvas.width
       var endBoundY = (zone.getHeight() * 32) - canvas.height
       if (camx >= endBoundX) { camx = endBoundX }
       if (camy >= endBoundY) { camy = endBoundY }
       if (camy <= 0) { camy = 0 }
       if (camx <= 0) { camx = 0 }
       ctx.translate(-camx, -camy);
       // Draw the remote players
       for (var i = 0; i < remotePlayers.length; i++) {
           if (remotePlayers[i].getZone() == localPlayer.getZone()) {
               drawPlayer(remotePlayers[i], ctx)
           }
       };
       // Draw the local player
       drawPlayer(localPlayer, ctx)
   };
   /**************************************************
    ** GAME HELPER FUNCTIONS
    **************************************************/
   function clamp(value, min, max) {
       if (value < min) return min;
       else if (value > max) return max;
       return value;
   }
   // Find player by ID
   function getPlayerById(id) {
       for (var i = 0; i < remotePlayers.length; i++) {
           if (remotePlayers[i].getID() == id) return remotePlayers[i];
       };
       return false;
   };
