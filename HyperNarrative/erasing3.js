let toolImgPen, toolImgEraser;
let mode = 'pen';              
let paper;                      

const PEN_OFFSET    = { x: 279, y: 85 };
const ERASER_OFFSET = { x: 65,  y: 260 };

let brushSize = 15;
let spring = 0.4, friction = 0.45;
let isBrushing = false, x = 0, y = 0, vx = 0, vy = 0, v = 0, r = 0, oldR = 0;
let splitNum = 100, diff = 2;

let crumbs = [];
let crumbImgs = [];
const GRAVITY = 0.25, AIR_DAMP = 0.95, BOUNCE = 0.15, GROUND_FRICTION = 0.85;
const SPAWN_CHANCE = 0.30, SPAWN_INTERVAL = 90, SPAWN_MIN_DIST = 28, MAX_CRUMBS = 120;
let lastSpawnAt = 0, lastSpawnPos = null;

function preload() {
  toolImgPen    = loadImage('assets/HandMarker.png');
  toolImgEraser = loadImage('assets/HandEraser.png');
  for (let i = 1; i <= 3; i++) {
    try { crumbImgs.push(loadImage(`assets/crumb${i}.png`)); } catch(e) {}
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('drawCanvas');
  paper = createGraphics(width, height);
  paper.background(255);
  paper.strokeCap(ROUND);
  noCursor(); 
  
}

function draw() {
  background(255);
  image(paper, 0, 0);  

  if (mouseIsPressed && mouseInCanvas()) {
    if (mode === 'pen') {
      brushStepOnPaperPen();      
    } else {
      paintWhiteSoft(paper, mouseX, mouseY, pmouseX, pmouseY);  
      maybeSpawnCrumb(mouseX, mouseY);                          
    }
  } else if (isBrushing) {
    isBrushing = false; vx = vy = 0;
  }

 
  updateCrumbs();
  renderCrumbs();

 
  const img = (mode === 'pen') ? toolImgPen : toolImgEraser;
  const off = (mode === 'pen') ? PEN_OFFSET  : ERASER_OFFSET;
  if (img) image(img, mouseX - off.x, mouseY - off.y);
}
 
function brushStepOnPaperPen() {
  paper.stroke(0);
  if (!isBrushing) { isBrushing = true; x = mouseX; y = mouseY; }

  vx += (mouseX - x) * spring; vy += (mouseY - y) * spring;
  vx *= friction;               vy *= friction;
  v += Math.hypot(vx, vy) - v;  v *= 0.55;
  oldR = r; r = brushSize - v;

  for (let i = 0; i < splitNum; i++) {
    let oldX = x, oldY = y;
    x += vx / splitNum; y += vy / splitNum;
    oldR += (r - oldR) / splitNum; if (oldR < 1) oldR = 1;

    paper.strokeWeight(oldR + diff); paper.line(x, y, oldX, oldY);
    paper.strokeWeight(oldR);
    paper.line(x + diff * random(0.1, 2), y + diff * random(0.1, 2),
               oldX + diff * random(0.1, 2), oldY + diff * random(0.1, 2));
    paper.line(x - diff * random(0.1, 2), y - diff * random(0.1, 2),
               oldX - diff * random(0.1, 2), oldY - diff * random(0.1, 2));
  }
}

 
function paintWhiteSoft(g, x, y, px, py) {
  let brushSize = 100
  g.noStroke();
  const steps = max(1, int(dist(x, y, px, py) / (brushSize * 0.35)));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ix = lerp(px, x, t), iy = lerp(py, y, t);

    const rings = 5;  
    for (let r = rings; r >= 1; r--) {
      const d = (brushSize * r) / rings;
      const alpha = map(r, rings, 1, 70, 255);  
      g.fill(255, alpha);
      g.circle(ix, iy, d);
    }
  }
}

 
function maybeSpawnCrumb(x, y) {
  const now = millis();
  const timeOk = (now - lastSpawnAt) >= SPAWN_INTERVAL;
  let distOk = !lastSpawnPos || dist(x, y, lastSpawnPos.x, lastSpawnPos.y) >= SPAWN_MIN_DIST;
  const luckOk = random(1) < SPAWN_CHANCE;

  if (timeOk && distOk && luckOk && crumbs.length < MAX_CRUMBS) {
    crumbs.push(new Crumb(x, y));
    lastSpawnAt = now; lastSpawnPos = { x, y };
  }
}

class Crumb {
  constructor(x, y) {
    this.x = x + random(-3, 3);
    this.y = y + random(-3, 3);
    this.vx = random(-0.6, 0.6);
    this.vy = random(-0.2, 0.2);
    this.size = random(12, 26);
    this.rot = random(TAU); this.vr = random(-0.08, 0.08);
    this.life = 90;
    this.img = crumbImgs.length ? random(crumbImgs) : null;
  }
  update() {
    this.vy += GRAVITY;
    this.vx *= AIR_DAMP; this.vy *= AIR_DAMP;
    this.x += this.vx;   this.y += this.vy; this.rot += this.vr;

    if (this.y > height - this.size / 2) {
      this.y = height - this.size / 2;
      this.vy *= -BOUNCE; this.vx *= GROUND_FRICTION; this.life -= 2;
    }
    this.life--;
  }
  draw() {
    push(); translate(this.x, this.y); rotate(this.rot); imageMode(CENTER);
    const alpha = map(this.life, 0, 90, 0, 255);
    if (this.img) { tint(255, alpha); image(this.img, 0, 0, this.size, this.size); }
    else { noStroke(); fill(220, alpha); circle(0, 0, this.size); }
    pop();
  }
  dead() { return this.life <= 0; }
}

function updateCrumbs() {
  for (let i = crumbs.length - 1; i >= 0; i--) {
    crumbs[i].update();
    if (crumbs[i].dead()) crumbs.splice(i, 1);
  }
  if (crumbs.length > MAX_CRUMBS) crumbs.splice(0, crumbs.length - MAX_CRUMBS);
}
function renderCrumbs() { for (const c of crumbs) c.draw(); }

 
function keyPressed() {
  if (key === 'e' || key === 'E') mode = (mode === 'pen') ? 'eraser' : 'pen';
}
function mouseInCanvas() {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}
