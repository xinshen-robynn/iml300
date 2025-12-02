// clouds.js  —— 飘动的祥云背景

let cloudImgs = [];
let clouds = [];
let cnv;

// 改成你自己的 5 个文件名
const cloudFiles = [
  "Asset/祥云1.png",
  "Asset/祥云2.png",
  "Asset/祥云3.png",
  "Asset/祥云4.png",
  "Asset/祥云5.png"
];

function preload() {
  for (let i = 0; i < cloudFiles.length; i++) {
    cloudImgs[i] = loadImage(cloudFiles[i]);
  }
}

function setup() {
  // 创建画布，并挂到 #cloud-bg 这个 div 里
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("cloud-bg");

  imageMode(CENTER);
  noStroke();

  for (let img of cloudImgs) {
    clouds.push(new Cloud(img));
  }
}

function draw() {
  background(237,227,209,20);  // 如果想更“背景感”，也可以改成 background(255, 240);

  for (let c of clouds) c.update();
  separateClouds();
  for (let c of clouds) c.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ---------------- 云朵类 ----------------

class Cloud {
  constructor(img) {
    this.img = img;

    this.x = random(width);
    this.y = random(height);

    this.baseScale = random(0.5, 1.8);
    this.vx = random([-1, 1]) * random(0.5, 1.2);
    this.vy = random(-0.4, 0.4);

    this.nx = random(1000);
    this.ny = random(2000);

    this.angleSeed = random(1000);
    this.angleAmp = random(0.06, 0.16);
    this.angleSpeed = random(0.6, 1.4);
  }

  update() {
    let t = frameCount * 0.01;

    this.x += this.vx + map(noise(this.nx + t * 0.7), 0, 1, -0.7, 0.7);
    this.y += this.vy + map(noise(this.ny + t * 0.7), 0, 1, -0.6, 0.6);

    let breathe = map(
      noise(this.angleSeed + t * 0.6),
      0,
      1,
      0.9,
      1.15
    );
    this.scale = this.baseScale * breathe;

    this.angle =
      sin(t * this.angleSpeed + this.angleSeed) * this.angleAmp;

    let margin = 200;
    if (this.x > width + margin) this.x = -margin;
    if (this.x < -margin) this.x = width + margin;
    if (this.y > height + margin) this.y = -margin;
    if (this.y < -margin) this.y = height + margin;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    let w = this.img.width * this.scale;
    let h = this.img.height * this.scale;

    tint(255, 255);
    image(this.img, 0, 0, w, h);
    noTint();

    pop();
  }

  getRadius() {
    return (max(this.img.width, this.img.height) * this.scale) / 2;
  }
}

// ---------------- 分离逻辑 ----------------

function separateClouds() {
  for (let i = 0; i < clouds.length; i++) {
    for (let j = i + 1; j < clouds.length; j++) {
      let c1 = clouds[i];
      let c2 = clouds[j];

      let dx = c2.x - c1.x;
      let dy = c2.y - c1.y;
      let d = sqrt(dx * dx + dy * dy);

      let minD = (c1.getRadius() + c2.getRadius()) * 0.75;

      if (d > 0 && d < minD) {
        let overlap = (minD - d) * 0.05;
        let nx = dx / d;
        let ny = dy / d;

        c1.x -= nx * overlap;
        c1.y -= ny * overlap;
        c2.x += nx * overlap;
        c2.y += ny * overlap;
      }
    }
  }
}

