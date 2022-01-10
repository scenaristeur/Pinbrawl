let MAX_SPEED = 50//25
let GRAVITY = 0.25;
let leftScore = 0, rightScore = 0;
let state;
let menuSelection = 0;
let menu = ["0player", "1player", "2player"]; // "guide"
let width, height
let orientation = "portrait"
let hole = 300
let device;

function preload() {
  pixelFont = loadFont('assets/joystix monospace.ttf');
  bg = loadImage('assets/background.png');
  middleCircleImage = loadImage('assets/middle circle.png');
  smallCircleImage = loadImage('assets/small circle.png');
  rectangleBumperImage = loadImage('assets/rectangle bumper.png');
  sideCircleImage = loadImage('assets/side circle.png');
  paddleImage = loadImage('assets/paddle.png');
  wallImage = loadImage('assets/wall.png');
  ballImage = loadImage('assets/ball.png');
  endScreenImage1 = loadImage('assets/p1Wins.png');
  endScreenImage2 = loadImage('assets/p2Wins.png');
  arrowImage = loadImage('assets/arrow.png');
  arrowUpImage = loadImage('assets/arrowUp.png');
  arrowDownImage = loadImage('assets/arrowDown.png');

  // soundFormats('ogg', 'mp3');
  // song = loadSound('assets/actualrealpinball.mp3');
}

function setup() {
  let device = getDeviceType()
  if (device == "mobile") {
    width = windowWidth //800 // windowWidth
    height = windowHeight  //450 // windowHeight/2
  }else{
    width = 360 //2*windowWidth / 3 //800 // windowWidth
    height = 560  //450 // windowHeight/2
  }
  document.getElementById("debug").innerHTML = device+" "+width+" "+height
  //width = 900 //windowWidth
  //height = 700 //windowHeight
  createCanvas(width, height);

  state = "2player" //"menu" //used to tell when the game is over

  ball = new Ball();

  paddle1 = new Paddle(width/2-hole/4, height-50, 200, 140, -1, 1, -1);
  paddle2 = new Paddle(width/2+hole/4, height-50, -20, 40, 1, 1, 1);
  // paddle1 = new Paddle(50, 150, -60, -120, -1, 1, -1);
  // paddle2 = new Paddle(50, 300, 60, 120, 1, 1, 1);
  // paddle3 = new Paddle(750, 150, 240, 300, 1, 1, 1);
  // paddle4 = new Paddle(750, 300, -240, -300, -1, 1, -1);

  walls = new Group();
  walls_list = [
    new Wall(width/2+hole/2+60, height-100, 225, 30, -20),
    new Wall(width/2-hole/2-60, height-100, 225, 30, 20),
    new Wall(3*width/4+hole/2, height-225, 225, 30, -55),
    new Wall(width/4-hole/2, height-225, 225, 30, 55),
    new Wall(10, 270, 225, 30, 90),
    new Wall(width-10, 270, 225, 30, 90),
    new Wall(120, 100, 225, 30, -30),
    new Wall(width-120, 100, 225, 30, 30),
    new Wall(335, 20, 225, 30, 0),
    new Wall(width-335, 20, 225, 30, 0),

    // new Wall(108, 400, 225, 30, 60),
    // new Wall(692, 50, 225, 30, 60),
    // new Wall(692, 400, 225, 30, -60),
    // new Wall(width / 2, -25, width, 50, 0),
    // new Wall(width / 2, height + 25, width, 50, 0),
  ]

  obstacles = new Group();
  obstacles_list = [
    new Obstacle(10, middleCircleImage, "circle", width/2, height/2, 50),

    // new Obstacle(5, rectangleBumperImage, "rectangle", 250, 125, 50, 100, 50),
    // new Obstacle(5, rectangleBumperImage, "rectangle", width-250, 125, 50, 100, -50),
    // // new Obstacle(10, middleCircleImage, "circle", 400, 225, 50),
    // new Obstacle(5, smallCircleImage, "circle", 150, 325, 25),
    // new Obstacle(5, smallCircleImage, "circle", width-380, 200, 25),
    // new Obstacle(25, sideCircleImage, "circle", 380, 200, 50),
    // new Obstacle(25, sideCircleImage, "circle", width-150, 325, 50),
  ];


}

function draw() {
  // print(state);
  background(bg);
  let reset = createButton('reset');
  reset.position(0, 0);
  reset.mousePressed(resetgame);

  if (state != "game over") {
    ball.update();
  }

  // bot controls
  if (state == "0player" || state == "menu") {
    // bots play vs. each other
    paddle1.bot();
    paddle2.bot();
  }
  if (state == "1player" || state == "0player" || state == "menu") {
    // paddle3.bot();
    // paddle4.bot();
  }

  if (state != "game over") {
    paddle1.update();
    paddle2.update();
    // paddle3.update();
    // paddle4.update();

    ball.sprite.bounce(walls);

    ball.sprite.bounce(obstacles, function (pinball, obstacle) {
      // find the specific obstacle that was hit
      for (let i = 0; i < obstacles_list.length; i++) {
        if (obstacle == obstacles_list[i].sprite) {
          ball.score += obstacles_list[i].score;
        }
      }
    })

    drawSprites();

    // Score Display
    fill(254, 205, 26);
    textFont(pixelFont, 28);
    textAlign(LEFT, CENTER);
    text(leftScore, 16, 40);
    textAlign(RIGHT, CENTER);
    text(rightScore, width - 16, 40);
    textAlign(CENTER, CENTER);
    text(ball.score, width / 2, height / 2 - 4);
  }

  if (state == "menu") {
    let zero = createButton('0 player');
    zero.position(0, 0);
    zero.mousePressed(zeroPlayer);
    let one = createButton('1 player');
    one.position(100, 0);
    one.mousePressed(onePlayer);
    let two = createButton('2 players');
    two.position(200, 0);
    two.mousePressed(twoPlayers);
    // fill(color('rgba(0, 0, 0, 0.5)'));
    // rect(0, 0, width, height); // transparent background
    // fill(254, 205, 26);
    // textFont(pixelFont, 100);
    // textAlign(CENTER);
    // text("PINBRAWL", width / 2, 100);
    // // menu elements
    // textSize(40);
    // for (let i = 0; i < menu.length; i++) {
    //   text(menu[i], width / 2, 200 + 50 * i);
    // }
    // image(arrowImage, 530, 185 + 50 * menuSelection); // arrowDownImage
    //
    // // control icons
    // textAlign(CENTER)
    // textSize(40);
    // text("W", 200, 200);
    // text("S", 200, 300);
    // image(arrowUpImage, 580, 187);
    // image(arrowDownImage, 580, 287);
  }
  if (state != "game over" && state != "menu" && (leftScore >= 999) || (rightScore >= 999)) {
    state = "game over";
  }
  if (state == "game over") {
    endScreen();
  }

}


function zeroPlayer(){
  console.log("zero")
  state = "0player"
}

function onePlayer(){
  console.log("one")
  state = "1player"
}

function twoPlayers(){
  console.log("two")
  state = "2player"
}

function keyPressed() {
  console.log(key)
  if (key == 'a' || key == 'w') {
    if (state == "2player" || state == "1player") {
      paddle1.flip()
    }
    if (state == "menu") {
      menuSelection--;
      if (menuSelection < 0) {
        menuSelection = menu.length - 1;
      }
    }
  }
  if (key == 'z' || key == 's' || key == 'd') {
    if (state == "2player" || state == "1player") {
      paddle2.flip()
    }
    if (state == "menu") {
      menuSelection++;
      if (menuSelection > menu.length - 1) {
        menuSelection = 0;
      }
    }
  }
  if (key == 'k' || keyCode == LEFT_ARROW || keyCode == UP_ARROW) {
    if (state == "2player") {
      paddle3.sprite.rotationSpeed = paddle3.speed * paddle3.direction;
      paddle3.swinging = true;
    }
    if (state == "1player") {
      paddle1.flip()
    }
    if (state == "menu") {
      menuSelection--;
      if (menuSelection < 0) {
        menuSelection = menu.length - 1;
      }
    }
  }
  if (key == 'm' || keyCode == RIGHT_ARROW || keyCode == DOWN_ARROW) {
    if (state == "2player") {
      paddle4.sprite.rotationSpeed = paddle4.speed * paddle4.direction;
      paddle4.swinging = true;
    }
    if (state == "1player") {
      paddle2.flip()
    }
    if (state == "menu") {
      menuSelection++;
      if (menuSelection > menu.length - 1) {
        menuSelection = 0;
      }
    }
  }
  if (keyCode == ENTER) {
    // change game state based on menu selection
    if (state == "menu") {
      state = menu[menuSelection];
      resetgame();
    }
    if (state == "game over") {
      state = "menu";
      resetgame();
    }
  }
  if(key == 'r'){
    resetgame()
  }
}

function keyReleased() {
  if (key == 'a' || key == 'w') {
    if (state == "2player" || state == "1player") {
      paddle1.back()
    }
  }
  if (key == 'z' || key == 's' || key == 'd') {
    if (state == "2player" || state == "1player") {
      paddle2.back()
    }
  }
  if (key == 'k' || keyCode == LEFT_ARROW || keyCode == UP_ARROW) {
    if (state == "2player") {
      paddle3.sprite.rotationSpeed = -paddle3.speed * paddle3.direction;
      paddle3.swinging = false;
    }
    if (state == "1player") {
      paddle1.back()
    }
  }
  if (key == 'm' || keyCode == RIGHT_ARROW || keyCode == DOWN_ARROW) {
    if (state == "2player") {
      paddle4.sprite.rotationSpeed = -paddle4.speed * paddle4.direction;
      paddle4.swinging = false;
    }
    if (state == "1player") {
      paddle2.back()
    }
  }

}


function touchStarted(e) {
  console.log(e)
  //  document.getElementById('debug').innerHTML = JSON.stringify(e)
  let display = touches.length + ' touches';
  text(display, 5, 10);
  document.getElementById('debug').innerHTML = frameRate()+"<br>touch<br>"+mouseX+ '<br>'+
  mouseY+ '<br>'
  +display
  +'<br>'+JSON.stringify(touches)
  if(touches.length ==  1 || touches.length == 2){
    touches.forEach((t) => {
      if (t.y > height - 300){
        if(t.x < width/2){
          document.getElementById('debug').innerHTML += "left <br>"
          paddle1.flip()
        }
        if (t.x > width/2){
          document.getElementById('debug').innerHTML += "right <br>"
          paddle2.flip()
        }
      }
    });

  }
  //  clickOrTouch(e)
}

function touchEnded(event) {
  console.log(event);
  document.getElementById('debug').innerHTML = frameRate()+"<br>end"+ JSON.stringify(touches)
  if (touches.length == 0){
    paddle1.back()
    paddle2.back()
  }

  // lag
  // else if(touches.length ==  1 || touches.length == 2){
  //   touches.forEach((t) => {
  //     if (t.y > height - 300){
  //       if(t.x < width/2){
  //         document.getElementById('debug').innerHTML += "left <br>"
  //         paddle1.flip()
  //       }else{
  //         paddle1.back()
  //       }
  //       if (t.x > width/2){
  //         document.getElementById('debug').innerHTML += "right <br>"
  //         paddle2.flip()
  //       }else{
  //         paddle2.back()
  //       }
  //     }
  //   })
  // }
}


function endScreen() {
  textFont(pixelFont, 28);
  textAlign(CENTER, CENTER);
  fill(254, 205, 26);
  if (leftScore >= 999) {
    background(endScreenImage1);
    if (state == "1player") {
      text("You win! Great Job!", 20, 10, 800, 90)
    }
  } else if (rightScore >= 999) {
    background(endScreenImage2);
    if (state == "1player") {
      text("The AI won! Nice Try!", 20, 10, 800, 90)
    }
  }
  text("Press ENTER to restart.", 20, 80, 800, 600)
}

function resetgame() {
  console.log("reset")
  leftScore = 0;
  rightScore = 0;
  menuSelection = 0;
  background(bg);
  ball.reset(); // doesn't work TODO make ball reset
}
