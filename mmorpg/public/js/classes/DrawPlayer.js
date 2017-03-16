    char = new Image();
    char.src = "../assets/character.png";
    var drawPlayer = function(player, ctx) {
        var xCoord = player.getX() * 32
        var yCoord = player.getY() * 32
        var canAction = player.getCanAction()
        var direction = player.getDir()
        ctx.fillStyle = "#000000";
        ctx.fillText(player.getName(), xCoord, yCoord + 48);
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(xCoord, yCoord - 6, 32, 4);
        ctx.fillStyle = "#00FF00";
        var healthBar = Math.floor(32 * (player.getHealth() / 100))
        ctx.fillRect(xCoord, yCoord - 6, healthBar, 4);
        switch (direction) {
            // Controls
            case "down":
                ctx.drawImage(char, 0, 0, 32, 32, xCoord, yCoord, 32, 32);
                if (!canAction) {
                    ctx.drawImage(actions, 0, 0, 32, 32, xCoord, yCoord + 32, 32, 32);
                }
                break;
            case "up":
                ctx.drawImage(char, 32, 0, 32, 32, xCoord, yCoord, 32, 32);
                if (!canAction) {
                    ctx.drawImage(actions, 0, 0, 32, 32, xCoord, yCoord - 32, 32, 32);
                }
                break;
            case "left":
                ctx.drawImage(char, 64, 0, 32, 32, xCoord, yCoord, 32, 32);
                if (!canAction) {
                    ctx.drawImage(actions, 0, 0, 32, 32, xCoord - 32, yCoord, 32, 32);
                }
                break;
            case "right":
                ctx.drawImage(char, 96, 0, 32, 32, xCoord, yCoord, 32, 32);
                if (!canAction) {
                    ctx.drawImage(actions, 0, 0, 32, 32, xCoord + 32, yCoord, 32, 32);
                }
                break;
        };
    };
