let MAX_SPEED = 25, GRAVITY = 0.25;
let leftScore = 0, rightScore = 0;
let state;
let menuSelection = 0;
let menu = ["0player", "1player", "2player"]; // "guide"

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
  createCanvas(450, 700);

  state = "menu" //used to tell when the game is over

  ball = new Ball();

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
    new Obstacle(5, rectangleBumperImage, "rectangle", 250, 125, 50, 100, 50),
    new Obstacle(5, rectangleBumperImage, "rectangle", 550, 325, 50, 100, 50),
    new Obstacle(10, middleCircleImage, "circle", 400, 225, 50),
    new Obstacle(5, smallCircleImage, "circle", 250, 325, 25),
    new Obstacle(5, smallCircleImage, "circle", 550, 125, 25),
    new Obstacle(25, sideCircleImage, "circle", 400, -10, 50),
    new Obstacle(25, sideCircleImage, "circle", 400, 460, 50),
  ];


}

function draw() {
  // print(state);
  background(bg);


  if (state != "game over") {
    paddle1.update();
    paddle2.update();
    paddle3.update();
    paddle4.update();

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
