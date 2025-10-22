// const link = document.querySelector('a.keyword');
// let t;
// link.addEventListener('mousemove', () => {
//   link.classList.add('erased');
//   clearTimeout(t);
//   t = setTimeout(() => link.classList.remove('erased'), 120); // 停止移动后恢复
// });


const link = document.querySelector('a.keyword');
let t;

const eraseSound = new Audio('assets/EraserSound.MP3');
eraseSound.volume = 0.7; 

link.addEventListener('mousemove', () => {
  link.classList.add('erased');
  clearTimeout(t);
  t = setTimeout(() => link.classList.remove('erased'), 120);
});

link.addEventListener('click', (e) => {
  e.preventDefault(); 
  eraseSound.currentTime = 0; 
  eraseSound.play();

  eraseSound.onended = () => {
    window.location.href = link.href;
  };
});
