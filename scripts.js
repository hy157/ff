let defaultState = {
  energy: 1000,
  gold: 1000,
  diamond: 0,
  wheat: 0,
  bread: 0,
  cookie: 0,
  flour: 0,
  water: 0,
  tarlalar: [{id: 1, x: 40, y: 50, state:"empty", growth:0}], // BAŞLANGIÇTA BİR BOŞ TARLA
  binalar: [],
  nextId: 2, // İlk tarlamız 1 id'siyle başladı!
  maxTarlalar: 4
};
let state = JSON.parse(JSON.stringify(defaultState));
let müzikAçık = true;
let harita = document.getElementById("harita");

function splashUpdate() {
  let kayıt = localStorage.getItem('tarimSave');
  let loadBtn = document.getElementById('loadBtn');
  loadBtn.disabled = !kayıt;
}
function hideSplash() {
  document.getElementById("splash").style.display = "none";
  document.getElementById("game-area").style.display = "block";
  startMusic();
  updateInfoBar();
  drawHarita();
}
document.getElementById("playNewBtn").onclick = () => {
  state = JSON.parse(JSON.stringify(defaultState));
  hideSplash();
}
document.getElementById("loadBtn").onclick = () => {
  let kayıt = localStorage.getItem('tarimSave');
  if (kayıt) {
    state = JSON.parse(kayıt);
    hideSplash();
  }
};
splashUpdate();

let musicEl = document.getElementById("gameMusic");
function startMusic() { if(müzikAçık) musicEl.play(); }
function stopMusic() { musicEl.pause(); musicEl.currentTime=0; }
function toggleMusic(val) {
  müzikAçık = val;
  if (müzikAçık) startMusic();
  else stopMusic();
}

function updateInfoBar() {
  document.getElementById("energyVal").textContent = state.energy;
  document.getElementById("goldVal").textContent = state.gold;
  document.getElementById("diamondVal").textContent = state.diamond || 0;
}

function drawHarita() {
  harita.innerHTML = '';
  state.tarlalar.forEach(obj => {
    harita.appendChild(createObjectEl(obj, "tarla"));
  });
  state.binalar.forEach(obj => {
    harita.appendChild(createObjectEl(obj, "bina"));
  });
}

function createObjectEl(obj, tip) {
  let div = document.createElement("div");
  div.className = "object " + tip;
  div.style.position = "absolute";
  div.style.left = (obj.x) + "vw";
  div.style.top = (obj.y) + "vh";
  div.dataset.id = obj.id;
  div.dataset.tip = tip;
  let img = document.createElement("img");

  if (tip === "tarla") {
    let src = "field.png";
    if (obj.state === "empty" || !obj.state) src = "field.png";
    else if (obj.state === "planted" && obj.growth < 8) src = "fieldfide.png";
    else if (obj.state === "planted" && obj.growth < 16) src = "fieldgreenwheat.png";
    else if (obj.state === "ready") src = "fieldwheatrh.png";
    img.src = "assets/images/" + src;
    img.style.width = "40vw";
    img.style.maxWidth = "180px";
    img.style.minWidth = "96px";
    img.style.display = "block";
    div.appendChild(img);

    div.onclick = (e) => {
      e.stopPropagation();
      showFieldMenu(obj, div);
    };
  } else {
    if (obj.type === "windmill") img.src = "assets/images/windmill.png";
    else if (obj.type === "oven") img.src = "assets/images/oven.png";
    else if (obj.type === "well") img.src = "assets/images/waterwell.png";
    img.alt = tip;
    img.style.width = "56vw";  // 2x büyük
    img.style.maxWidth = "256px";
    img.style.minWidth = "110px";
    div.appendChild(img);
  }

  enableDrag(div, obj, tip);
  return div;
}

function showFieldMenu(tarlaObj, parentDiv) {
  if (document.getElementById("field-menu")) return;
  let menu = document.createElement("div");
  menu.id = "field-menu";
  menu.style.left = parentDiv.style.left;
  menu.style.top = `calc(${parentDiv.style.top} - 13vw)`;
  if (!tarlaObj.state || tarlaObj.state === "empty") {
    let seedBtn = document.createElement("img");
    seedBtn.src = "assets/images/iconseed.png";
    seedBtn.style.width = "11vw";
    seedBtn.style.cursor = "pointer";
    seedBtn.onclick = (e) => {
      e.stopPropagation();
      plantSeed(tarlaObj);
      menu.remove();
    };
    menu.appendChild(seedBtn);
  } else if (tarlaObj.state === "ready") {
    let sickleBtn = document.createElement("img");
    sickleBtn.src = "assets/images/iconsickle.png";
    sickleBtn.style.width = "11vw";
    sickleBtn.style.cursor = "pointer";
    sickleBtn.onclick = (e) => {
      e.stopPropagation();
      harvestField(tarlaObj, parentDiv);
      menu.remove();
    };
    menu.appendChild(sickleBtn);
  }
  document.body.appendChild(menu);
  setTimeout(()=>{
    document.body.addEventListener("touchstart", removeFieldMenu, {once:true});
    document.body.addEventListener("mousedown", removeFieldMenu, {once:true});
  },50);
  function removeFieldMenu(e) {
    if (e && e.target === menu) return;
    menu.remove();
  }
}

function plantSeed(tarlaObj) {
  if (state.gold < 1) return alert("Yeterli coin yok!");
  if (state.energy < 1) return alert("Yeterli enerji yok!");
  state.gold -= 1;
  state.energy -= 1;
  tarlaObj.state = "planted";
  tarlaObj.growth = 0;
  updateInfoBar();
  drawHarita();
  startGrowth(tarlaObj);
}

function startGrowth(tarlaObj) {
  tarlaObj.timer = setInterval(() => {
    if (!tarlaObj.state || tarlaObj.state !== "planted") { clearInterval(tarlaObj.timer); return; }
    tarlaObj.growth++;
    if (tarlaObj.growth === 8 || tarlaObj.growth === 16) drawHarita();
    if (tarlaObj.growth >= 16) {
      clearInterval(tarlaObj.timer);
      tarlaObj.state = "ready";
      drawHarita();
    }
  }, 1000);
}

function harvestField(tarlaObj, parentDiv) {
  tarlaObj.state = "empty";
  tarlaObj.growth = 0;
  animateWheatAndCoin(parentDiv);
  state.wheat += 2;
  state.gold += 2;
  updateInfoBar();
  drawHarita();
}

function animateWheatAndCoin(parentDiv) {
  let wheat = document.createElement("img");
  wheat.src = "assets/images/iconwheat.png";
  wheat.style.position = "fixed";
  let rect = parentDiv.getBoundingClientRect();
  wheat.style.left = (rect.left + rect.width/2 - 24) + "px";
  wheat.style.top = (rect.top - 10) + "px";
  wheat.style.width = "32px";
  wheat.style.zIndex = 9999;
  wheat.style.transition = "all .8s cubic-bezier(.22,1.02,.36,1)";
  wheat.style.opacity = "1";
  document.body.appendChild(wheat);

  let coin = document.createElement("img");
  coin.src = "assets/images/icongold.png";
  coin.style.position = "fixed";
  coin.style.left = (rect.left + rect.width/2 + 8) + "px";
  coin.style.top = (rect.top + 18) + "px";
  coin.style.width = "30px";
  coin.style.zIndex = 9999;
  coin.style.transition = "all .8s cubic-bezier(.22,1.02,.36,1)";
  coin.style.opacity = "1";
  document.body.appendChild(coin);

  setTimeout(()=>{
    wheat.style.transform = "translateY(-48px) scale(1.4)";
    wheat.style.opacity = "0";
    coin.style.transform = "translateY(-60px) scale(1.3)";
    coin.style.opacity = "0";
  },20);
  setTimeout(()=>wheat.remove(), 850);
  setTimeout(()=>coin.remove(), 870);
}

// Uzun bas-sürükle
function enableDrag(div, obj, tip) {
  let startX, startY, offsetX, offsetY, dragging=false, longPress;
  div.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    offsetX = startX - div.getBoundingClientRect().left;
    offsetY = startY - div.getBoundingClientRect().top;
    dragging = false;
    longPress = setTimeout(()=>{
      div.classList.add("selected");
      dragging = true;
    }, 450);
    document.body.style.userSelect = "none";
  }, {passive:true});
  div.addEventListener('touchmove', function(e) {
    if (dragging) {
      let nx = (e.touches[0].clientX - offsetX) / window.innerWidth * 100;
      let ny = (e.touches[0].clientY - offsetY) / window.innerHeight * 100;
      nx = Math.max(0, Math.min(88, nx));
      ny = Math.max(0, Math.min(70, ny));
      div.style.left = nx+"vw";
      div.style.top = ny+"vh";
      obj.x = nx;
      obj.y = ny;
    }
  }, {passive:false});
  div.addEventListener('touchend', function(e) {
    clearTimeout(longPress);
    div.classList.remove("selected");
    document.body.style.userSelect = "";
    dragging = false;
  });
}

// BARN
function openBarn() {
  document.querySelectorAll(".modal-bg").forEach(x=>x.remove());
  let modal = document.createElement("div");
  modal.className = "modal-bg";
  const urunler = [
    {key:"wheat", label:"Buğday", price: 3, icon:"iconwheat.png"},
    {key:"bread", label:"Ekmek", price: 7, icon:"iconbread.png"},
    {key:"cookie", label:"Kurabiye", price: 8, icon:"iconcookie.png"},
    {key:"flour", label:"Un", price: 5, icon:"iconflour.png"},
    {key:"water", label:"Su", price: 2, icon:"iconwater.png"}
  ];
  let html = `<div class="modal-panel">
    <button class="close-btn" onclick="this.closest('.modal-bg').remove()">&times;</button>
    <h3>Ürünleri Sat</h3>
    <div style="overflow-x:auto;">
    <table style="width:100%;margin:0 auto;font-size:4vw;min-width:220px;">
      <tr><th>Ürün</th><th>Adet</th><th>Fiyat</th><th>Sat</th></tr>`;
  urunler.forEach(u=>{
    html += `<tr>
      <td><img src="assets/images/${u.icon}" style="width:7vw;min-width:24px;"> ${u.label}</td>
      <td>${state[u.key]||0}</td>
      <td><img src="assets/images/icongold.png" style="width:6vw;min-width:19px;"> ${u.price}</td>
      <td><button onclick="sellProduct('${u.key}',${u.price})" style='padding:1vw 2vw;border-radius:8px;border:none;background:#ffe083;font-size:3vw;'>Sat</button></td>
    </tr>`;
  });
  html += `</table></div></div>`;
  modal.innerHTML = html;
  document.body.appendChild(modal);
}
window.sellProduct = function(key, price) {
  if((state[key]||0)<1) return;
  state[key]--;
  state.gold += price;
  updateInfoBar();
  document.querySelector('.modal-bg').remove();
  openBarn();
};

// STORE
function openStore() {
  document.querySelectorAll(".modal-bg").forEach(x=>x.remove());
  let modal = document.createElement("div");
  modal.className = "modal-bg";
  // Hangi bina alındıysa tekrar alınamaz
  let owned = {windmill: false, oven: false, well: false};
  state.binalar.forEach(b=>{
    if(b.type==="windmill") owned.windmill = true;
    if(b.type==="oven") owned.oven = true;
    if(b.type==="well") owned.well = true;
  });
  let html = `<div class="modal-panel">
    <button class="close-btn" onclick="this.closest('.modal-bg').remove()">&times;</button>
    <h3>Store</h3>
    <div style="margin:2vw 0 3vw 0;">
      <strong>Tarla satın al:</strong><br>
      <button onclick="buyField()" ${state.tarlalar.length>=state.maxTarlalar?'disabled style="opacity:0.5;"':''} style="padding:1vw 4vw;font-size:4vw;border-radius:7px;margin:1vw;">
        <img src="assets/images/field.png" style="width:14vw;vertical-align:middle;"> 
        12 <img src="assets/images/icongold.png" style="width:5vw;">
      </button>
      <span style="font-size:3vw;color:#906;">(${state.tarlalar.length}/${state.maxTarlalar})</span>
    </div>
    <div style="margin:2vw 0 2vw 0;">
      <strong>Bina satın al:</strong>
      <div style="display:flex;gap:3vw;justify-content:center;flex-wrap:wrap;">
        <div>
          <button onclick="buyBuilding('windmill',25)" ${owned.windmill?'disabled style="opacity:0.5;"':''} style="padding:1vw 3vw;border-radius:9px;border:none;background:#ffe083;font-size:3vw;">
            <img src="assets/images/windmill.png" style="width:24vw;vertical-align:middle;"> Değirmen<br>
            <img src="assets/images/icongold.png" style="width:4vw;">25
          </button>
        </div>
        <div>
          <button onclick="buyBuilding('oven',25)" ${owned.oven?'disabled style="opacity:0.5;"':''} style="padding:1vw 3vw;border-radius:9px;border:none;background:#ffe083;font-size:3vw;">
            <img src="assets/images/oven.png" style="width:24vw;vertical-align:middle;"> Fırın<br>
            <img src="assets/images/icongold.png" style="width:4vw;">25
          </button>
        </div>
        <div>
          <button onclick="buyBuilding('well',10)" ${owned.well?'disabled style="opacity:0.5;"':''} style="padding:1vw 3vw;border-radius:9px;border:none;background:#ffe083;font-size:3vw;">
            <img src="assets/images/waterwell.png" style="width:24vw;vertical-align:middle;"> Kuyu<br>
            <img src="assets/images/icongold.png" style="width:4vw;">10
          </button>
        </div>
      </div>
    </div></div>`;
  modal.innerHTML = html;
  document.body.appendChild(modal);
}
window.buyField = function() {
  if(state.gold<12 || state.tarlalar.length>=state.maxTarlalar) return;
  state.gold -= 12;
  state.tarlalar.push({id:state.nextId++, x:30+Math.random()*30, y:38+Math.random()*20, state:"empty", growth:0});
  updateInfoBar(); drawHarita();
  document.querySelector('.modal-bg').remove();
}
window.buyBuilding = function(type, price) {
  let already = state.binalar.find(b=>b.type===type);
  if(already) return;
  if(state.gold<price) return;
  state.gold -= price;
  state.binalar.push({id:state.nextId++, type, x:30+Math.random()*30, y:22+Math.random()*38});
  updateInfoBar(); drawHarita();
  document.querySelector('.modal-bg').remove();
}

document.getElementById("btnBarn").onclick = openBarn;
document.getElementById("btnStore").onclick = openStore;
document.getElementById("btnTasks").onclick = function() { alert("Görevler çok yakında!"); };
document.getElementById("btnMap").onclick = function() { alert("Haritada tarlaları uzun basıp taşıyabilirsin."); };
document.getElementById("btnSettings").onclick = function() {
  let modal = document.createElement("div");
  modal.className = "modal-bg";
  let html = `<div class="modal-panel">
    <button class="close-btn" onclick="this.closest('.modal-bg').remove()">&times;</button>
    <h3>Ayarlar</h3>
    <div style="margin:4vw 0 2vw 0;">
      <label style="font-size:4vw;">
        <input type="checkbox" id="musicCheck" ${müzikAçık?'checked':''} style="transform:scale(1.5);vertical-align:middle;margin-right:3vw;">
        Müzik Açık
      </label>
    </div>
    <button onclick="saveGame()" style="margin-top:3vw;padding:2vw 7vw;font-size:4vw;background:#ffdd75;border:none;border-radius:8px;color:#744a0a;font-weight:bold;">Kayıt Et</button>
    <div style="font-size:3vw;color:#bb9500;margin-top:2vw;">Tüm oyun kaydedilir.</div>
  </div>`;
  modal.innerHTML = html;
  document.body.appendChild(modal);
  document.getElementById("musicCheck").onchange = function() {
    toggleMusic(this.checked);
  }
};
window.saveGame = function() {
  localStorage.setItem('tarimSave', JSON.stringify(state));
  alert("Kayıt başarılı!");
}

window.addEventListener('touchmove', function(e){ if(e.target.closest('.object')) return; e.preventDefault(); }, { passive:false });
updateInfoBar();
drawHarita();
