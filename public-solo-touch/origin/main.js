// Declare your variables here

let MAX_SPEED = 25, GRAVITY = 0.25;
let leftScore = 0, rightScore = 0;
let song;
let state;
let menuSelection = 0;
let menu = ["0player", "1player", "2player"]; // "guide"
let width, height


////
let cnv;
let d;
let g;
let side = 0


// Runs once before setup()
function preload() {
  pixelFont = loadFont('origin/assets/joystix monospace.ttf');
  bg = loadImage('origin/assets/background.png');
  middleCircleImage = loadImage('origin/assets/middle circle.png');
  smallCircleImage = loadImage('origin/assets/small circle.png');
  rectangleBumperImage = loadImage('origin/assets/rectangle bumper.png');
  sideCircleImage = loadImage('origin/assets/side circle.png');
  paddleImage = loadImage('origin/assets/paddle.png');
  wallImage = loadImage('origin/assets/wall.png');
  ballImage = loadImage('origin/assets/ball.png');
  ball2Image = loadImage('origin/assets/ball2.png');
  endScreenImage1 = loadImage('origin/assets/p1Wins.png');
  endScreenImage2 = loadImage('origin/assets/p2Wins.png');
  arrowImage = loadImage('origin/assets/arrow.png');
  arrowUpImage = loadImage('origin/assets/arrowUp.png');
  arrowDownImage = loadImage('origin/assets/arrowDown.png');


  // soundFormats('ogg', 'mp3');
  // song = loadSound('origin/assets/actualrealpinball.mp3');
}

// Runs once before draw()
function setup() {
  width = 800 //2*windowWidth / 3 //800 // windowWidth
  height = 450//2*windowHeight / 3 //450 // windowHeight/2
  cnv = createCanvas(width, height); //createCanvas(100, 100);
  cnv.touchStarted(changeGray); // attach listener for
  // canvas click only
  cnv.mouseClicked(changeGray);
  d = 10;
  g = 100;
  // song.setVolume(0.5);
  // song.loop();

  state = "menu" //used to tell when the game is over

  ball = new Ball(ballImage);
  ball2 = new Ball(ball2Image);

  paddle1 = new Paddle(50, 150, -60, -120, -1, 1, -1);
  paddle2 = new Paddle(50, 300, 60, 120, 1, 1, 1);
  paddle3 = new Paddle(750, 150, 240, 300, 1, 1, 1);
  paddle4 = new Paddle(750, 300, -240, -300, -1, 1, -1);

  walls = new Group();
  walls_list = [
    new Wall(108, 50, 225, 30, -60),
    new Wall(108, 400, 225, 30, 60),
    new Wall(692, 50, 225, 30, 60),
    new Wall(692, 400, 225, 30, -60),
    new Wall(width / 2, -25, width, 50, 0),
    new Wall(width / 2, height + 25, width, 50, 0),
  ]

  obstacles = new Group();
  obstacles_list = [
    new Obstacle(5, rectangleBumperImage, "rect", 250, 125, 50, 100, 50),
    new Obstacle(5, rectangleBumperImage, "rect", 550, 325, 50, 100, 50),
    new Obstacle(10, middleCircleImage, "circle", 400, 225, 50),
    new Obstacle(5, smallCircleImage, "circle", 250, 325, 25),
    new Obstacle(5, smallCircleImage, "circle", 550, 125, 25),
    new Obstacle(25, sideCircleImage, "circle", 400, -10, 50),
    new Obstacle(25, sideCircleImage, "circle", 400, 460, 50),
  ];
}

// Runs in a loop forever
function draw() {
  // print(state);
  background(bg);

  if (state != "game over") {
    ball.update();
    ball2.update();
   socket.emit("ball",{x: ball.sprite.x, y: ball.sprite.y})
  }

  // bot controls
  if (state == "0player" || state == "menu") {
    // bots play vs. each other
    paddle1.bot();
    paddle2.bot();
  }
  if (state == "1player" || state == "0player" || state == "menu") {
    paddle3.bot();
    paddle4.bot();
  }

  if (state != "game over") {
    paddle1.update();
    paddle2.update();
    paddle3.update();
    paddle4.update();

    ball.sprite.bounce(walls);
    ball2.sprite.bounce(walls);

    ball.sprite.bounce(obstacles, function (pinball, obstacle) {
      // find the specific obstacle that was hit
      for (let i = 0; i < obstacles_list.length; i++) {
        if (obstacle == obstacles_list[i].sprite) {
          ball.score += obstacles_list[i].score;
        }
      }
    })

    ball2.sprite.bounce(obstacles, function (pinball, obstacle) {
      // find the specific obstacle that was hit
      for (let i = 0; i < obstacles_list.length; i++) {
        if (obstacle == obstacles_list[i].sprite) {
          ball2.score += obstacles_list[i].score;
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
      text(ball2.score, width / 2, height / 2 + 4);
  }

  if (state == "menu") {
    fill(color('rgba(0, 0, 0, 0.5)'));
    rect(0, 0, width, height); // transparent background
    fill(254, 205, 26);
    textFont(pixelFont, 100);
    textAlign(CENTER);
    text("PINBRAWL", width / 2, 100);
    // menu elements
    textSize(40);
    for (let i = 0; i < menu.length; i++) {
      text(menu[i], width / 2, 200 + 50 * i);
    }
    image(arrowImage, 530, 185 + 50 * menuSelection); // arrowDownImage

    // control icons
    textAlign(CENTER)
    textSize(40);
    text("W", 200, 200);
    text("S", 200, 300);
    image(arrowUpImage, 580, 187);
    image(arrowDownImage, 580, 287);
  }

  // guide WIP
  if (state == "guide") {
    fill(color('rgba(0, 0, 0, 0.5)'));
    rect(0, 0, width, height); // transparent background
    fill(254, 205, 26);
    textFont(pixelFont, 100);
    textAlign(CENTER);
    text("GUIDE", width / 2, 100);
    // guide text
    textSize(40);
  }

  if (state != "game over" && state != "menu" && (leftScore >= 999) || (rightScore >= 999)) {
    state = "game over";
  }
  if (state == "game over") {
    endScreen();
    ball.desroy()
    ball2.destroy()
  }
}

function keyPressed() {
  console.log("socket.id", socket.id)
  socket.emit('action',{actor: socket.id, key: key})
  if (key == 'a' || key == 'w') {
    if (state == "2player" || state == "1player") {
      paddle1.sprite.rotationSpeed = paddle1.speed * paddle1.direction;
      paddle1.swinging = true;
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
      paddle2.sprite.rotationSpeed = paddle2.speed * paddle2.direction;
      paddle2.swinging = true;
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
      side = -1
      document.getElementById('debug').innerHTML = side
      socket.emit('action',{actor: socket.id, side: side, key: "left"})

    }
    if (state == "1player") {
      paddle1.sprite.rotationSpeed = paddle1.speed * paddle1.direction;
      paddle1.swinging = true;
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
      side = 1
      document.getElementById('debug').innerHTML = side
      socket.emit('action',{actor: socket.id, side: side, key: "right"})

    }
    if (state == "1player") {
      paddle2.sprite.rotationSpeed = paddle2.speed * paddle2.direction;
      paddle2.swinging = true;
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
}

function keyReleased() {
  if (key == 'a' || key == 'w') {
    if (state == "2player" || state == "1player") {
      paddle1.sprite.rotationSpeed = -paddle1.speed * paddle1.direction;
      paddle1.swinging = false;
    }
  }
  if (key == 'z' || key == 's' || key == 'd') {
    if (state == "2player" || state == "1player") {
      paddle2.sprite.rotationSpeed = -paddle2.speed * paddle2.direction;
      paddle2.swinging = false;
    }
  }
  if (key == 'k' || keyCode == LEFT_ARROW || keyCode == UP_ARROW) {
    if (state == "2player") {
      paddle3.sprite.rotationSpeed = -paddle3.speed * paddle3.direction;
      paddle3.swinging = false;
    }
    if (state == "1player") {
      paddle1.sprite.rotationSpeed = -paddle1.speed * paddle1.direction;
      paddle1.swinging = false;
    }
  }
  if (key == 'm' || keyCode == RIGHT_ARROW || keyCode == DOWN_ARROW) {
    if (state == "2player") {
      paddle4.sprite.rotationSpeed = -paddle4.speed * paddle4.direction;
      paddle4.swinging = false;
    }
    if (state == "1player") {
      paddle2.sprite.rotationSpeed = -paddle2.speed * paddle2.direction;
      paddle2.swinging = false;
    }
  }
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
  leftScore = 0;
  rightScore = 0;
  menuSelection = 0;
  background(bg);
  ball.reset(); // doesn't work TODO make ball reset
  ball2.reset()
}


// this function fires with any touch anywhere
function touchStarted(e) {
  let display = touches.length + ' touches';
  text(display, 5, 10);
  document.getElementById('debug').innerHTML = "touch<br>"+mouseX+ '<br>'+
  mouseY+ '<br>'
  +display
  //  +'<br>'+JSON.stringify(touches)
  clickOrTouch(e)
  socket.emit('action',{actor: socket.id, side: side, endroit: "global"})

}
// this function fires after the mouse has been
// clicked anywhere
function mouseClicked(e) {
  document.getElementById('debug').innerHTML = "mouse<br>"+mouseX+ '<br>'+ mouseY+ '<br>'+JSON.stringify(e)
  clickOrTouch(e)
}

function clickOrTouch(e){
  console.log(mouseX, mouseY, e)
  d = d + 10;
  if (mouseX < windowWidth / 2){
    side = -1
  }else if (mouseX > windowWidth / 2){
    side = 1
  }else {
    side = 0
  }
  document.getElementById('debug').innerHTML += "<br>"+side
  socket.emit('action',{actor: socket.id, side: side})

}

// function keyPressed() {
//   if (key == 'w' || keyCode == LEFT_ARROW) {
//     side = -1
//   } else if (key == '!' || keyCode == RIGHT_ARROW) {
//     side = 1
//   }else{
//     side = 0
//   }
//
//   document.getElementById('debug').innerHTML = side
// }

// this function fires only when cnv is clicked
function changeGray(e) {
  console.log(e)
  g = random(0, 255);

  socket.emit('action',{actor: socket.id, side: side, endroit: "canevas" })

}
