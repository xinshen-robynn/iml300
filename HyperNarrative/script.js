const link = document.querySelector('a.keyword');
let t;
link.addEventListener('mousemove', () => {
  link.classList.add('erased');
  clearTimeout(t);
  t = setTimeout(() => link.classList.remove('erased'), 120); // 停止移动后恢复
});
