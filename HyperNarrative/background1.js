

let img;
let drawLayer;
let crumbs = [];
let brushSize = 40;
let softEdge = true;
let showCursor = true;
let scaleFactor = 1;
let crumbImgs = [];


const GRAVITY = 0.25;        
const AIR_DAMP = 0.95;        
const BOUNCE = 0.15;          
const GROUND_FRICTION = 0.85; /
const SPAWN_CHANCE = 0.30;    
const SPAWN_INTERVAL = 90;    
const SPAWN_MIN_DIST = 28;    
const MAX_CRUMBS = 120;       

let lastSpawnAt = 0;
let lastSpawnPos = null;
// -------------------------------------------------------------

function preload() {
  img = loadImage('assets/draft.png');          // 按你现在的路径
  for (let i = 1; i <= 3; i++) {
    crumbImgs.push(loadImage(`assets/crumb${i}.png`)); // crumb1/2/3.png
  }
}

function setup() {
  pixelDensity(1);
  const maxW = 900;
  scaleFactor = min(1, maxW / img.width);
  createCanvas(img.width * scaleFactor, img.height * scaleFactor);

  img.resize(width, height);
  drawLayer = createGraphics(width, height);
  drawLayer.clear();
  background(255);
}

function draw() {
  background(255);
  image(img, 0, 0);
  image(drawLayer, 0, 0);

  if (mouseIsPressed && mouseInCanvas()) {
    paintWhite(drawLayer, mouseX, mouseY, pmouseX, pmouseY);
    maybeSpawnCrumb(mouseX, mouseY); // ← 稀疏生成
  }

  updateCrumbs();
  renderCrumbs();

  if (showCursor && mouseInCanvas()) {
    noFill();
    stroke(0, 80);
    circle(mouseX, mouseY, brushSize);
  }
}

// 稀疏生成逻辑：时间 + 距离 + 概率 三重限制
function maybeSpawnCrumb(x, y) {
  const now = millis();
  const timeOk = (now - lastSpawnAt) >= SPAWN_INTERVAL;

  let distOk = true;
  if (lastSpawnPos) {
    distOk = dist(x, y, lastSpawnPos.x, lastSpawnPos.y) >= SPAWN_MIN_DIST;
  }
  const luckOk = random(1) < SPAWN_CHANCE;

  if (timeOk && distOk && luckOk && crumbs.length < MAX_CRUMBS) {
    spawnCrumbs(x, y, 1); // 每次至多1个
    lastSpawnAt = now;
    lastSpawnPos = { x, y };
  }
}

// === 白色软笔刷 ===
function paintWhite(g, x, y, px, py) {
  g.noStroke();
  const steps = max(1, int(dist(x, y, px, py) / (brushSize * 0.35)));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ix = lerp(px, x, t);
    const iy = lerp(py, y, t);
    if (softEdge) {
      const rings = 5;
      for (let r = rings; r >= 1; r--) {
        const d = (brushSize * r) / rings;
        const alpha = map(r, rings, 1, 60, 255);
        g.fill(255, alpha);
        g.circle(ix, iy, d);
      }
    } else {
      g.fill(255);
      g.circle(ix, iy, brushSize);
    }
  }
}


class Crumb {
  constructor(x, y) {
    this.x = x + random(-3, 3);
    this.y = y + random(-3, 3);
    this.vx = random(-0.6, 0.6);    
    this.vy = random(-0.2, 0.2);
    this.size = random(12, 26);    
    this.rot = random(TAU);
    this.vr = random(-0.08, 0.08);
    this.life = 90;                
    this.img = crumbImgs.length ? random(crumbImgs) : null;
  }
  update() {
    this.vy += GRAVITY;           
    this.vx *= AIR_DAMP;  
    this.vy *= AIR_DAMP;
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.vr;

    // 地面
    if (this.y > height - this.size / 2) {
      this.y = height - this.size / 2;
      this.vy *= -BOUNCE;          
      this.vx *= GROUND_FRICTION;   
      this.life -= 2;
    }
    this.life--;
  }
  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.rot);
    imageMode(CENTER);
    const alpha = map(this.life, 0, 90, 0, 255);
    if (this.img) {
      tint(255, alpha);
      image(this.img, 0, 0, this.size, this.size);
    } else {
      noStroke();
      fill(220, alpha);
      circle(0, 0, this.size);
    }
    pop();
  }
  dead() { return this.life <= 0; }
}

function spawnCrumbs(x, y, count) {
  for (let i = 0; i < count; i++) crumbs.push(new Crumb(x, y));
}

function updateCrumbs() {
  for (let i = crumbs.length - 1; i >= 0; i--) {
    crumbs[i].update();
    if (crumbs[i].dead()) crumbs.splice(i, 1);
  }
  // 保险：如果超过上限，丢掉最老的
  if (crumbs.length > MAX_CRUMBS) {
    crumbs.splice(0, crumbs.length - MAX_CRUMBS);
  }
}

function renderCrumbs() {
  for (const c of crumbs) c.draw();
}

function mouseInCanvas() {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}
