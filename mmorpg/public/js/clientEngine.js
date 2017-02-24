   var canvas; // Canvas DOM element
   var ctx; // Canvas rendering context
   var keys; // Keyboard input
   var localPlayer; // Local player
   var remotePlayers; // Remote players
   var socket; // Socket connection
   //
   tiles = new Image();
   tiles.src = "../assets/tiles.png";
   objects = new Image();
   objects.src = "../assets/objects.png";
   //
   function init() {
       socket = io.connect('/', { transports: ["websocket"] });
       canvas = document.getElementById("gameCanvas");
       ctx = canvas.getContext("2d");
       canvas.width = 512;
       canvas.height = 512;
       keys = new Keys();
       remotePlayers = [];
       localPlayer = [];
       setEventHandlers();
   }
   //////////////////////////////////////////////////////////////////////////////////////
   function setEventHandlers() {
       window.addEventListener("keydown", onKeydown, false);
       window.addEventListener("keyup", onKeyup, false);
       socket.on("getUserDataClient", getUserDataClient);
       socket.on("newPlayerClient", newPlayer);
       socket.on("movePlayerClient", movePlayer);
       socket.on("removePlayerClient", removePlayer);
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

   function disconnectPlayer(data) {
       console.log('user disconnected');
       alert("Server Connection Lost")
       window.location.href = './';
   }

   function getUserDataClient(data) {
       localPlayer = new Player(data.id, data.x, data.y);
       console.log("----------------------------------------------")
       console.log('ID:  ' + localPlayer.getID());
       console.log('X:  ' + localPlayer.getX());
       console.log('Y:  ' + localPlayer.getY());
       console.log('Data:  ' + data.userData);
       console.log("----------------------------------------------")
       socket.emit("getPlayersServer");
       animate();
   };

   function newPlayer(data) {
       // Add new player to the remote players array
       var newPlayer = new Player(data.id, data.x, data.y);
       if (localPlayer.id != newPlayer.id) {
           console.log("Player connected: " + newPlayer.id);
           remotePlayers.push(newPlayer);
       }
   };

   function movePlayer(data) {
       var movePlayer = playerById(data.id);
       // Player not found
       if (!movePlayer) {
           console.log("Player not found: " + data.id);
           return;
       };
       // Update player position
       movePlayer.setX(data.x);
       movePlayer.setY(data.y);
   };

   function removePlayer(data) {
       console.log("Player Removed: " + data.id);
       var removePlayer = playerById(data.id);
       // Player not found
       if (!removePlayer) {
           console.log("Player not found: " + data.id);
           return;
       };
       // Remove player from array
       remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
   };
   /**************************************************
    ** GAME ANIMATION LOOP
    **************************************************/
   function animate() {
       update();
       draw();
       // Request a new animation frame using Paul Irish's shim
       // window.requestAnimationFrame(window.requestAnimationFrame);
       // window.requestAnimFrame(animate);
       // window.setTimeout(animate, 50);
   };
   /**************************************************
    ** GAME UPDATE
    **************************************************/
   var map = {
       cols: 16,
       rows: 16,
       tsize: 32,
       layers: [
           [
               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
           ],
           [
               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
           ],
           [
               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
               1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
           ]
       ],
       getTile: function(layer, col, row) {
           return this.layers[layer][row * map.cols + col];
       }
   };
   //
   function update() {
       // Update local player and check for change
       var prevX = localPlayer.getX(),
           prevY = localPlayer.getY();
       var newX = localPlayer.getX(),
           newY = localPlayer.getY();
           //
       if (keys.up & !keys.down) {
           newY -= localPlayer.getMoveSpeed()
       } else if (!keys.up & keys.down) {
           newY += localPlayer.getMoveSpeed()
       }
       //
       if (keys.left & !keys.right) {
           newX -= localPlayer.getMoveSpeed()
       } else if (!keys.left & keys.right) {
           newX += localPlayer.getMoveSpeed()
       };
       localPlayer.setX(newX)
       localPlayer.setY(newY)
       if ((prevX != newX || prevY != newY) ? true : false) {
           socket.emit("movePlayerServer", { id: localPlayer.getID(), x: localPlayer.getX(), y: localPlayer.getY() });
       };
       // window.requestAnimationFrame(update)
       window.setTimeout(update, 80);
   };
   /**************************************************
    ** GAME DRAW
    **************************************************/
   function draw() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       for (var x = 0; x <= map.cols; x++) {
           for (var y = 0; y <= map.rows; y++) {
               ctx.drawImage(tiles, map.getTile(1, x, y) * map.tsize, 0, map.tsize, map.tsize, x * map.tsize, y * map.tsize, map.tsize, map.tsize);
           }
       }
       for (var x = 0; x <= map.cols; x++) {
           for (var y = 0; y <= map.rows; y++) {
               ctx.drawImage(objects, map.getTile(2, x, y) * map.tsize, 0, map.tsize, map.tsize, x * map.tsize, y * map.tsize, map.tsize, map.tsize);
           }
       }
       // Draw the local player
       localPlayer.draw(ctx);
       // Draw the remote players
       var i;
       for (i = 0; i < remotePlayers.length; i++) {
           remotePlayers[i].draw(ctx);
       };
       // window.requestAnimationFrame(draw)
       window.setTimeout(draw, 1000/60);
   };
   /**************************************************
    ** GAME HELPER FUNCTIONS
    **************************************************/
   // Find player by ID
   function playerById(id) {
       var i;
       for (i = 0; i < remotePlayers.length; i++) {
           if (remotePlayers[i].id == id) return remotePlayers[i];
       };
       return false;
   };
