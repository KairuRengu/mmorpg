   var canvas; // Canvas DOM element
   var ctx; // Canvas rendering context
   var keys; // Keyboard input
   var localPlayer; // Local player
   var remotePlayers; // Remote players
   var socket; // Socket connection
   var playerList;
   var consoleList;
   tiles = new Image();
   tiles.src = "../assets/tiles.png";
   objects = new Image();
   objects.src = "../assets/objects.png";
   actions = new Image();
   actions.src = "../assets/actions.png";
   //
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
       },
       getCoord: function(x, y) {
           // var playerX = x+map.tsize/2;
           // var playerX = y+map.tsize/2;
           // return playerX
           var low1 = 0
           var low2 = 0
           var high1 = 512
           var high2 = 16
           var value = x + 16
           var xCoord = Math.floor(low2 + (high2 - low2) * (x + 16 - low1) / (high1 - low1));
           var yCoord = Math.floor(low2 + (high2 - low2) * (y + 16 - low1) / (high1 - low1));
           return this.getTile(0, xCoord, yCoord)
               // return this.layers[0][row * map.cols + col];
       }
   };
   //
   //
   function init() {
       socket = io.connect('/', { transports: ["websocket"] });
       playerList = document.getElementById("playerList");
       consoleList = document.getElementById("consoleList");
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
       var item = document.createElement('li');
       item.appendChild(document.createTextNode(localPlayer.getID()));
       playerList.appendChild(item);
       animate();
   };

   function newPlayer(data) {
       // Add new player to the remote players array
       var newPlayer = new Player(data.id, data.x, data.y);
       if (localPlayer.id != newPlayer.id) {
           console.log("Player connected: " + newPlayer.id);
           remotePlayers.push(newPlayer);
           var item = document.createElement('li');
           item.appendChild(document.createTextNode(newPlayer.id));
           playerList.appendChild(item);
           consoleText(newPlayer.id + " Joined The Server")
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
       var lis = playerList.getElementsByTagName("li");
       for (var i = lis.length - 1; i >= 0; i--) {
           console.log(lis[i].textContent)
           if (lis[i].textContent == data.id) {
               lis[i].remove()
           }
       }
       var removePlayer = playerById(data.id);
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
       // Request a new animation frame using Paul Irish's shim
       // window.requestAnimationFrame(window.requestAnimationFrame);
       window.requestAnimFrame(animate);
       // window.setTimeout(animate, 50);
   };
   /**************************************************
    ** GAME UPDATE
    **************************************************/
   //
   function moveLeft() {
       if (map.getCoord(localPlayer.getX() - 17, localPlayer.getY()) != 0) {
           return
       }
       var newX = localPlayer.getX()
       newX -= localPlayer.getMoveSpeed()
       localPlayer.setX(newX)
   }

   function moveRight() {
       if (map.getCoord(localPlayer.getX() + 16, localPlayer.getY()) != 0) {
           return
       }
       var newX = localPlayer.getX()
       newX += localPlayer.getMoveSpeed()
       localPlayer.setX(newX)
   }

   function moveUp() {
       if (map.getCoord(localPlayer.getX(), localPlayer.getY() - 17) != 0) {
           return
       }
       var newY = localPlayer.getY()
       newY -= localPlayer.getMoveSpeed()
       localPlayer.setY(newY)
   }

   function moveDown() {
       if (map.getCoord(localPlayer.getX(), localPlayer.getY() + 16) != 0) {
           return
       }
       var newY = localPlayer.getY()
       newY += localPlayer.getMoveSpeed()
       localPlayer.setY(newY)
   }

   function actionReset() {
       localPlayer.setCanAction(true);
   }

   function update() {
       // var prevX = localPlayer.getX(),
       //     prevY = localPlayer.getY();
       if (keys.up & !keys.down) {
           moveUp()
           localPlayer.setDir("up")
       }
       if (!keys.up & keys.down) {
           moveDown()
           localPlayer.setDir("down")
       }
       //
       if (keys.left & !keys.right) {
           moveLeft();
           localPlayer.setDir("left")
       }
       if (!keys.left & keys.right) {
           moveRight();
           localPlayer.setDir("right")
       };
       if (keys.z) {
           if (localPlayer.getCanAction()) {
               console.log("ATTACK")
               localPlayer.setCanAction(false);
               setTimeout(function() { actionReset() }, localPlayer.getAttackSpeed());
           }
       };
       if (keys.x) {
           console.log("USE")
       };
       // if ((prevX != newX || prevY != newY) ? true : false) {
       socket.emit("movePlayerServer", { id: localPlayer.getID(), x: localPlayer.getX(), y: localPlayer.getY() });
       // };
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
       // Draw the remote players
       for (var i = 0; i < remotePlayers.length; i++) {
           remotePlayers[i].draw(ctx);
       };
       // Draw the local player
       localPlayer.draw(ctx);
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
