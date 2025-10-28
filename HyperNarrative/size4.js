let imgs = [];
let index = 0;

function preload() {
  imgs = [
    loadImage('assets/EraserLarge.png'),
    loadImage('assets/EraserMid.png'),
    loadImage('assets/EraserSmall.png'),
    loadImage('assets/EraserNon.png')
  ];
}

function setup() {
  const c = createCanvas(windowWidth, windowHeight);  
  c.parent('size4');                                 
  imageMode(CENTER);
}

function draw() {
  clear();  
  if (!imgs.length) return;

  const im = imgs[index];
  const s = Math.min(width / im.width, height / im.height);
  image(im, width / 2, height / 2, im.width * s, im.height * s);
}

function mousePressed() {
  index = (index + 1) % imgs.length; 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
