let bgs = [];
let positions = [];
let eraser;
let eraserW = 160;
let eraserH = 160;

let ex, ey;
let dragging = false;
let showBG = true;

function preload() {
  bgs.push(loadImage("assets/dancing.png"));
  bgs.push(loadImage("assets/bird.png"));
  bgs.push(loadImage("assets/hook.png"));
  bgs.push(loadImage("assets/Star.png"));

  eraser = loadImage("assets/EraserSmall.png");
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('disapper7');  
  imageMode(CENTER);

  positions = [
    { x: 200, y: 200, w: 500, h: 400 },
    { x: 1300, y: 500, w: 800, h: 500 },
    { x: 1200, y: 120, w: 600, h: 520 },
    { x: 400, y: 680, w: 800, h: 640 }
  ];

  ex = width / 2;
  ey = height - 100;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ex = width / 2;
  ey = height - 80;
}


function draw() {
  background(255);

  if (showBG) {
    for (let i = 0; i < bgs.length; i++) {
      let p = positions[i];
      image(bgs[i], p.x, p.y, p.w, p.h);
    }
  }

  image(eraser, ex, ey, 300, 300);
}

function mousePressed() {
  if (dist(mouseX, mouseY, ex, ey) < 150) dragging = true; 
}

function mouseDragged() {
  if (dragging) {
    ex = mouseX;
    ey = mouseY;
  }
}

function mouseReleased() {
  if (dragging) {
    dragging = false;
    showBG = false;
  }
}
