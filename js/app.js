//Object to handle game functions
function GameHandler(){
    this.inGame = true;
    this.level = 1;
}

//Hold player render for game over screen
GameHandler.prototype.render = function(){
    if(this.inGame === true){
        player.render();
    }
};

//Update Html for game over screen
GameHandler.prototype.changeGameOverHTML = function(){
    document.getElementById("header").innerHTML = "<p style=color:red;>Game Over!</p> <p> Final Score: " + player.score + "</p><p>Press Enter </p><p>to Continue</p>";
};

//Update HTML information
GameHandler.prototype.changeLevelHTML = function(){
    document.getElementById("header").innerHTML = " &nbsp; Level: " + this.level + "<br> &nbsp; Lives: " + player.lives  + " <br> &nbsp; Score: " + player.score;
};

//Solution from http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
GameHandler.prototype.getRandom = function(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
};

GameHandler.prototype.randomLeftRight = function(){
    return Math.random() < 0.5 ? true:false;
};

GameHandler.prototype.renderOffOn = function(startGame){
    this.inGame = startGame;
};

//Helper functions for Enemy
GameHandler.prototype.randomRow = function(){
    //place player objects and enemies in a random row
    var row1=65, row2=145, row3=225, row4=310, row5=390;
    var whichRow = this.getRandom(1, 6);
    switch(whichRow){
        case 1:
            return row1;
        case 2:
            return row2;
        case 3:
            return row3;
        case 4:
            return row4;
        case 5:
            return row5;
        default:
            break;
    }
};

/*http://blog.sklambert.com/html5-canvas-game-2d-collision-detection/  
*for more information on collision
*/
GameHandler.prototype.checkCollisions = function(){
    var widthHitBox = 75, heightHitBox = 50; //Object hit boxes
    allEnemies.forEach(function(enemy) {
        if(player.x < enemy.x + widthHitBox && player.x + widthHitBox > enemy.x &&
            player.y < enemy.y + heightHitBox && player.y + heightHitBox > enemy.y){
            //check for player hitting enemy
            player.x = 200;
            player.y = 480;
            player.lives--;
            gameHandler.changeLevelHTML();
            if(player.lives < 1){
                gameHandler.renderOffOn(false);
                gameHandler.changeGameOverHTML();
            }
        }
    });
    //goes through Each player object to detect collision
    playerObjects.forEach(function(playerObjects){
        if(player.x < playerObjects.x + widthHitBox && player.x + widthHitBox > playerObjects.x &&
            player.y < playerObjects.y + heightHitBox && player.y + 
            heightHitBox > playerObjects.y && playerObjects.show === true){
            //check is player is hitting objects
                playerObjects.toRender(false);
                if(playerObjects === greenGem || playerObjects === blueGem || playerObjects === orangeGem){//if player hits gems
                    player.score+=100;
                }
                else{//else it's heart
                    player.lives++;
                }
                gameHandler.changeLevelHTML();//update information to screen
            }
    });
};

//Helper function for Gems+Heart
GameHandler.prototype.randomColumn = function(){
    var col1 =-2, col2=99, col3 = 200, col4=301, col5=402;
    var whichCol=this.getRandom(1,6);
    switch(whichCol){
        case 1:
            return col1;
        case 2:
            return col2;
        case 3: 
            return col3;
        case 4:
            return col4;
        case 5:
            return col5;
        default:
            return;
    }
};

//Reset positions of Gems+hearts
GameHandler.prototype.resetPlayerObjects = function(){
    playerObjects.forEach(function(playerObjects){
        playerObjects.rePosition(gameHandler.randomColumn(), gameHandler.randomRow());
        playerObjects.toRender(true);
    });
};

//Game Reset
GameHandler.prototype.gameReset = function(){
    this.level = 1;
    player.lives = 5;
    player.score = 0;
    gameHandler.changeLevelHTML();
    allEnemies.forEach(function(enemy) {
            enemy.reset(gameHandler.randomLeftRight());
        });
    //removes enemies from allEnemies when game resets.
    allEnemies.splice(5,9);
};

GameHandler.prototype.updateLevel = function(){
    //push enemies into the array and generate more per level
    this.level++;
    if (this.level < 10){
        var enemy = new Enemy(gameHandler.randomRow(), gameHandler.randomLeftRight());
        allEnemies.push(enemy);
    }
};

var gameHandler = new GameHandler();

// Enemies our player must avoid
function Enemy(y, flipped) {
    //images located in reset function for flipped enemies
    this.reset(flipped);
    this.y = y;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // multiple movement by dt parameter
    if(this.x > 550 || this.x < -100){
        this.reset(gameHandler.randomLeftRight());
    }
    this.x += this.w * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//reset positions once off screen
Enemy.prototype.reset = function(flipped){
    var startLeft = -100;
    var startRight = 510;
    var minSpeed, maxSpeed; //Level effects excelleration
    if(gameHandler.level>2){
        minSpeed = 30; 
        maxSpeed = 70;
    }
    else if(gameHandler.level>4){
        minSpeed = 35; 
        maxSpeed = 75;
    }
    else if(gameHandler.level>6){
        minSpeed = 40; 
        maxSpeed = 80;
    }
    else if(gameHandler.level>8){
        minSpeed = 45; 
        maxSpeed = 80;
    }
    else{
        minSpeed = 20;
        maxSpeed = 65;
    }
    if(flipped === true){
        this.sprite = 'images/bug.png';
        this.x = startRight;
        this.y = gameHandler.randomRow();
        this.w = -gameHandler.getRandom(minSpeed, maxSpeed);//Level effects excelleration
    }
    else { 
        this.sprite = 'images/enemy-bug.png'; 
        this.x = startLeft;
        this.y = gameHandler.randomRow();
        this.w = gameHandler.getRandom(minSpeed, maxSpeed);//Level effects excelleration
    }
};

//Created allEnemies Array to iterate through
var allEnemies = [];
for(var i = 0; i < 5; i++){
    var enemy = new Enemy(gameHandler.randomRow(), gameHandler.randomLeftRight());
    allEnemies.push(enemy);
}
// Player Object - update(), render(), handleInput()
var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 480;
    this.lives = 5;
    this.score = 0;
};
Player.prototype.update = function(){
   this.x;
   this.y;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(input){
    var blockX = 101, blockY = 83;//col = 101 px space, row = 83 px, for left and right movement
    if (this.x >= -2 && this.x <= 402 && this.y > 10 && this.y <= 480 && gameHandler.inGame){
        if(input == 'left'){ 
            this.x -= blockX;
        }
        else if(input == 'right'){
            this.x += blockX;
        }
        else if(input == 'up'){
            this.y -= blockY;
        }
        else if(input == 'down'){
            this.y += blockY;
        }
    }
    if (this.y < 10){
            //if player goes into water, reset position
            this.x = 200;
            this.y = 480;
            player.score += 300;
            if(gameHandler.level < 10){
                //dont go over 10 levels
                gameHandler.updateLevel();
            }
            gameHandler.resetPlayerObjects();//reset player objects
            gameHandler.changeLevelHTML();//update score and levels
    }
    if (this.x < -2){ 
        //if x goes past canvas, reset to left most boundry
        this.x = -2;
    }
    if(this.x > 402){
        //if x goes past canvas/right, reset to right most boundry
        this.x = 402;
    }
    if (this.y > 480){
        //if y goes past bottom boundry, reset to bottom boundry
        this.y = 480;
    }
     //reset game if the game is ended
    if(gameHandler.inGame===false && input == 'enter'){
        gameHandler.renderOffOn(true);
        gameHandler.gameReset();
        gameHandler.resetPlayerObjects();
    }
};

var player = new Player();//create player

//Handles key input
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',//turn game on and off
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

//Gems object for multiple gems
function Gem(color, x, y){
    if(color === 'blue'){
        this.sprite ='images/Gem Blue.png';
    }
    else if(color === 'green'){
        this.sprite = 'images/Gem Green.png';
    }
    else if(color === 'orange'){
        this.sprite = 'images/Gem Orange.png';
    }
    else if(color === 'heart'){
        this.sprite = 'images/Heart.png';
    }
    this.x = x;
    this.y = y;
    this.show = true;
}

//set to false if player hits gem
Gem.prototype.toRender= function(render){
    this.show = render;
};

//if this.show===false do not render
Gem.prototype.render = function() {
    if(this.show===true){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};
//for repainting after level changes
Gem.prototype.rePosition = function(x, y){
    this.x = x;
    this.y = y;
};

//All the Gems...Truly...outrageous...and heart
var playerObjects = [];
var greenGem = new Gem('green', gameHandler.randomColumn(), gameHandler.randomRow());
var blueGem = new Gem('blue', gameHandler.randomColumn(), gameHandler.randomRow());
var orangeGem = new Gem('orange', gameHandler.randomColumn(), gameHandler.randomRow());
var heart = new Gem('heart', gameHandler.randomColumn(), gameHandler.randomRow());//heart

playerObjects.push(greenGem);
playerObjects.push(blueGem);
playerObjects.push(orangeGem);
playerObjects.push(heart);

