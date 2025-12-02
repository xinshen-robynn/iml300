/***************************************
 *  Future · 華笙 — Events Database JS
 *  功能：
 *    - 用户提交 event 信息 + 上传 jpg/png
 *    - 用 FileReader 把图片转成 base64（dataURL）
 *    - 把文字 + 图片 dataURL 一起存进 Realtime Database
 *    - 从数据库读取后，生成卡片展示
 ****************************************/

/* 1. Firebase 配置 & 初始化 */
// 可以用老师 demo 的 config，或者你自己项目的 config
// 这里先放一个占位，记得改成你自己的
const firebaseConfig = {
  apiKey: "AIzaSyCJcpTZe-b6S-HxilOSsvpP6j4pEvV5tl0",
  authDomain: "iml300-p3.firebaseapp.com",
  databaseURL: "https://iml300-p3-default-rtdb.firebaseio.com",
  projectId: "iml300-p3",
  storageBucket: "iml300-p3.firebasestorage.app",
  messagingSenderId: "702788624382",
  appId: "1:702788624382:web:b44f93bb9c768da7212aaf"
};


firebase.initializeApp(firebaseConfig);

// 实时数据库引用
const db = firebase.database();
const eventsRef = db.ref("events"); // 所有 event 都存到 "events" 节点下


/* 2. DOM 元素缓存 */

const form = document.getElementById("event-form");

const nameInput = document.getElementById("event-name");
const venueInput = document.getElementById("event-venue");
const locationInput = document.getElementById("event-location");
const dateInput = document.getElementById("event-date");

const fileInput = document.getElementById("event-poster-file");

const eventsContainer = document.getElementById("events-container");


/* 3. 监听数据库 — 有新 event 加入时，生成卡片 */

eventsRef.on("child_added", (snapshot) => {
  const id = snapshot.key;
  const data = snapshot.val();
  addEventCard(id, data);
});


/**
 * 生成并插入单个 event 卡片
 * @param {string} id - firebase 自动生成的 key
 * @param {object} data - event 数据
 */
function addEventCard(id, data) {
  const card = document.createElement("article");
  card.className = "event-card";

  /* --- 海报区域 --- */
  const posterDiv = document.createElement("div");
  posterDiv.className = "event-poster";

  if (data.posterDataUrl) {
    // 有上传图片：用 dataURL 作为 img 的 src
    const img = document.createElement("img");
    img.src = data.posterDataUrl;
    img.alt = data.name || "event poster";
    posterDiv.appendChild(img);
  } else {
    // 没图片：用占位文本
    const placeholder = document.createElement("div");
    placeholder.className = "event-poster-placeholder";
    placeholder.innerText = "NO POSTER · TEXT ONLY";
    posterDiv.appendChild(placeholder);
  }

  /* --- 文本信息区域 --- */
  const infoDiv = document.createElement("div");
  infoDiv.className = "event-info";

  const nameEl = document.createElement("h4");
  nameEl.className = "event-name";
  nameEl.innerText = data.name || "Untitled Event";

  const venueEl = document.createElement("p");
  venueEl.className = "event-venue";
  venueEl.innerText = data.venue || "";

  const metaEl = document.createElement("p");
  metaEl.className = "event-meta";
  metaEl.innerText = [
    data.location || "",
    data.date || ""
  ].filter(Boolean).join(" · ");

  infoDiv.appendChild(nameEl);
  infoDiv.appendChild(venueEl);
  infoDiv.appendChild(metaEl);

  card.appendChild(posterDiv);
  card.appendChild(infoDiv);

  // 新的 event 插到最前面（越新的越靠上）
  eventsContainer.insertBefore(card, eventsContainer.firstChild);
}


/* 4. 表单提交逻辑 — 上传图片 + 写入数据库 */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const venue = venueInput.value.trim();
  const location = locationInput.value.trim();
  const date = dateInput.value.trim();
  const file = fileInput.files[0]; // 用户上传的图片文件（可能为空）

  // 简单校验：必填字段
  if (!name || !venue || !location) {
    alert("Event 名称 / 地点 / 城市 是必填的～");
    return;
  }

  // 准备基础数据对象，图片先占位
  const newEvent = {
    name,
    venue,
    location,
    date,
    posterDataUrl: "",  // 稍后填入 dataURL
    createdAt: Date.now()
  };

  // 如果用户有上传图片，用 FileReader 读成 base64
  if (file) {
    // 简单限制一下大小（例如 2MB），可以按需删掉
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("图片有点大了～ 请压缩到 2MB 以内再试一次！");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (ev) {
      const dataUrl = ev.target.result;   // "data:image/png;base64,......"
      newEvent.posterDataUrl = dataUrl;

      // 把 event（含图片 dataURL）推到数据库
      eventsRef.push(newEvent)
        .then(() => {
          form.reset(); // 清空表单
        })
        .catch((err) => {
          console.error("Error saving event:", err);
          alert("提交失败了，可以稍后再试一下 T_T");
        });
    };

    // 以 DataURL 读取文件
    reader.readAsDataURL(file);

  } else {
    // 没有上传图片，仅存文字信息
    eventsRef.push(newEvent)
      .then(() => {
        form.reset();
      })
      .catch((err) => {
        console.error("Error saving event:", err);
        alert("提交失败了，可以稍后再试一下 T_T");
      });
  }
});
