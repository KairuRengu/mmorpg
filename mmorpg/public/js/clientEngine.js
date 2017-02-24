   var canvas; // Canvas DOM element
   var ctx; // Canvas rendering context
   var keys; // Keyboard input
   var localPlayer; // Local player
   var remotePlayers; // Remote players
   var socket; // Socket connection
   function init() {
       socket = io.connect('/', { transports: ["websocket"] });
       canvas = document.getElementById("gameCanvas");
       ctx = canvas.getContext("2d");
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
       keys = new Keys();
       remotePlayers = [];
       localPlayer = [];
       setEventHandlers();
   }
   //////////////////////////////////////////////////////////////////////////////////////
   function setEventHandlers() {
       window.addEventListener("keydown", onKeydown, false);
       window.addEventListener("keyup", onKeyup, false);
       window.addEventListener("resize", onResize, false);
       socket.on("getUserDataClient", getUserDataClient);
       socket.on("newPlayerClient", newPlayer);
       socket.on("movePlayerClient", movePlayer);
       socket.on("removePlayerClient", removePlayer);
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

   function onResize(e) {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
   };


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
       window.requestAnimFrame(animate);
   };
   /**************************************************
    ** GAME UPDATE
    **************************************************/
   function update() {
       // Update local player and check for change
       if (localPlayer.update(keys)) {
           // Send local player data to the game server
           socket.emit("movePlayerServer", { id: localPlayer.getID(), x: localPlayer.getX(), y: localPlayer.getY() });
       };
   };
   /**************************************************
    ** GAME DRAW
    **************************************************/
   function draw() {
       // Wipe the canvas clean
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       // Draw the local player
       localPlayer.draw(ctx);
       // Draw the remote players
       var i;
       for (i = 0; i < remotePlayers.length; i++) {
           remotePlayers[i].draw(ctx);
       };
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
