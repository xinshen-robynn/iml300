let song, fft;
let audioOn = false;
let audioLoaded = false;

function preload() {
  soundFormats('mp3', 'wav', 'ogg');
  // 👇 路径跟你现在用的音频一样
  song = loadSound('Asset/Zhuo.mp3', () => {
    audioLoaded = true;
    song.setVolume(0.25);
  });
}

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('p5-bg');   // 画布挂在背景 div 上
  fft = new p5.FFT();
}

function draw() {
  // 透明背景：不盖住底下的白色
  clear();

  // 没在播歌就不画波形
  if (!audioOn || !song || !song.isPlaying()) return;

  const waveform = fft.waveform();
  const margin = 60;
  const yCenter = height * 0.7;
  const h = height * 0.18;

  noFill();
  // 浅红色波形
  stroke(67,14,20);
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    const xPos = map(i, 0, waveform.length, margin, width - margin);
    const yPos = map(waveform[i], -1, 1, yCenter + h, yCenter - h);
    vertex(xPos, yPos);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * 给 HTML 调用的开关函数
 * 在 History.html 里通过点击图片调用它
 */
function toggleHistoryAudio() {
  if (!audioLoaded || !song) return;

  if (!audioOn) {
    // 第一次手动解锁 audio context
    userStartAudio().then(() => {
      song.loop();
      audioOn = true;
    });
  } else {
    song.pause();
    audioOn = false;
  }
}
