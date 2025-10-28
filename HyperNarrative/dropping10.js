let handImg, eraserImg;

let HAND_SCALE   = 0.3;
let HAND_OFFSET  = { x: 0, y: 20 };

let ERASER_W     = 200;
let ERASER_H     = 200;
let START_POS    = { x: 750, y: 700 }; // 初始位置（中心）

let GRAVITY      = 1.0;
let FLOOR_Y      = 530; // ← ← 改这里可以调“掉落停的位置”
let SNAP_DROP_X  = null; 
// =======================

let eraser = {
  x: 0, y: 0, w: ERASER_W, h: ERASER_H,
  held: false, falling: false, vy: 0,
  pickDX: 0, pickDY: 0
};

function preload() {
  handImg   = loadImage('assets/handgrabbing.png');
  eraserImg = loadImage('assets/EraserSmall.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('dropping10');
  imageMode(CENTER);
  noCursor();

  eraser.x = START_POS.x;
  eraser.y = START_POS.y;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  updateEraser();

  image(eraserImg, eraser.x, eraser.y, eraser.w, eraser.h);

  push();
  translate(mouseX - HAND_OFFSET.x, mouseY - HAND_OFFSET.y);
  scale(HAND_SCALE);
  image(handImg, 0, 0);
  pop();
}

function updateEraser() {
  if (eraser.held) {
    eraser.x = mouseX - eraser.pickDX;
    eraser.y = mouseY - eraser.pickDY;
    eraser.vy = 0;
    return;
  }

  if (eraser.falling) {
    eraser.vy += GRAVITY;
    eraser.y  += eraser.vy;

    const floor = FLOOR_Y;
    const bottom = eraser.y + eraser.h / 2;

    if (bottom >= floor) {
      eraser.y = floor - eraser.h / 2;
      eraser.vy = 0;
      eraser.falling = false;
    }
  }
}

function mousePressed() {
  if (handTouchEraser(mouseX, mouseY)) {
    eraser.held = true;
    eraser.falling = false;
    eraser.vy = 0;
    eraser.pickDX = mouseX - eraser.x;
    eraser.pickDY = mouseY - eraser.y;
  }
}

function mouseReleased() {
  if (eraser.held) {
    eraser.held = false;
    eraser.falling = true;
    if (typeof SNAP_DROP_X === 'number') eraser.x = SNAP_DROP_X;
  }
}

function handTouchEraser(mx, my) {
  return pointInRect(mx, my, eraser.x, eraser.y, eraser.w, eraser.h);
}

function pointInRect(px, py, cx, cy, w, h) {
  return (px >= cx - w/2 && px <= cx + w/2 && py >= cy - h/2 && py <= cy + h/2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
