let cnv
let d;
let g;

function setup() {
  width = windowWidth //2*windowWidth / 3 //800 // windowWidth
  height = windowHeight//2*windowHeight / 3 //450 // windowHeight/2
  cnv = createCanvas(width, height); //createCanvas(100, 100);
  // cnv.touchStarted(changeGray);
  //  cnv.touchStarted(action); // attach listener for
  // canvas click only
  //cnv.mouseClicked(action);
  d = 10;
 g = 100;

}

function draw(){
  background(g);

  clear();
let display = touches.length + ' touches';
// text(display, 5, 10);
text(JSON.stringify(touches[0]),5,10)
  // ellipse(width / 2, height / 2, d, d);
}

// this function fires with any touch anywhere
function touchStarted() {
  d = d + 10;
}

// this function fires only when cnv is clicked
function changeGray() {
  g = random(0, 255);
}
// function touchStarted() {
//   console.log(mouseX,mouseY, touches)
//   document.getElementById("debug").innerHTML = mouseX+" "+mouseY+" "+touches
// }
// function action(){
//   console.log(mouseX,mouseY, touches)
// }
