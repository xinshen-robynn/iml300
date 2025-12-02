let song, fft;
let audioOn = false;
let audioLoaded = false;

function preload() {
  soundFormats('mp3', 'wav', 'ogg');
  song = loadSound('Asset/Zhuo.mp3', () => {
    audioLoaded = true;
    song.setVolume(0.2); // 音量稍微小一点
  });
}

function setup() {
  const container = document.getElementById('p5-bg');
  const w = container.offsetWidth;
  const h = container.offsetHeight;

  const c = createCanvas(w, h);
  c.parent('p5-bg');

  fft = new p5.FFT();
}

function draw() {
  // 红色背景铺满整个条
  background(214, 0, 0); // #9e0b0bff

  // 没播歌就只显示红条
  if (!audioOn || !song || !song.isPlaying()) return;

  const waveform = fft.waveform();

  // 1️⃣ 先找本帧里的最大振幅，用来归一化
  let frameMax = 0;
  for (let i = 0; i < waveform.length; i++) {
    const a = Math.abs(waveform[i]);
    if (a > frameMax) frameMax = a;
  }
  // 防止静音时除以 0
  if (frameMax < 0.01) frameMax = 0.01;

  // 2️⃣ 白色竖条，从条的最左画到最右
  stroke(255);      // 白色 wave
  strokeWeight(1);  // 线粗细

  const yCenter = height / 2;
  const maxBarHeight = height;        // wave 可以占满整个红条高度
  const step = waveform.length / width; // 保证长度刚好 match 宽度

  for (let x = 0; x < width; x++) {
    const index = Math.floor(x * step);
    const amp = Math.abs(waveform[index]) / frameMax; // 0~1
    const bar = amp * maxBarHeight;

    const yTop = yCenter - bar / 2;
    const yBottom = yCenter + bar / 2;

    line(x, yTop, x, yBottom);
  }
}


function windowResized() {
  const container = document.getElementById('p5-bg');
  if (container) {
    resizeCanvas(container.offsetWidth, container.offsetHeight);
  }
}

// 给 HTML 调用的开关函数
function toggleHistoryAudio() {
  if (!audioLoaded || !song) return;

  if (!audioOn) {
    userStartAudio().then(() => {
      song.loop();
      audioOn = true;
    });
  } else {
    song.pause();
    audioOn = false;
  }
}
