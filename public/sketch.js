let cnv;
let d;
let g;
let side = 0
function setup() {
  cnv = createCanvas(windowWidth, windowHeight/2); //createCanvas(100, 100);
  cnv.touchStarted(changeGray); // attach listener for
  // canvas click only
  cnv.mouseClicked(changeGray);
  d = 10;
  g = 100;
}

function draw() {
  background(g);
  ellipse(width / 2, height / 2, d, d);
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
}

function keyPressed() {
  if (key == 'w' || keyCode == LEFT_ARROW) {
    side = -1
  } else if (key == '!' || keyCode == RIGHT_ARROW) {
    side = 1
  }else{
    side = 0
  }

  document.getElementById('debug').innerHTML = side
}

// this function fires only when cnv is clicked
function changeGray(e) {
  console.log(e)
  g = random(0, 255);
}
