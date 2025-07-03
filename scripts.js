// ------- STATE ---------
let defaultState = {
  energy: 5, gold: 0, diamond: 0, wheat: 0, bread: 0, cookie: 0, flour: 0, water: 0,
  tarlalar: [], binalar: [], nextId: 1, maxTarlalar: 4
};
let state = JSON.parse(JSON.stringify(defaultState));
let müzikAçık = true;
const ürünler = [
  {key:"wheat", label:"Buğday", price: 3, icon:"iconwheat.png"},
  {key:"bread", label:"Ekmek", price: 7, icon:"iconbread.png"},
  {key:"cookie", label:"Kurabiye", price: 8, icon:"iconcookie.png"},
  {key:"flour", label:"Un", price: 5, icon:"iconflour.png"},
  {key:"water", label:"Su", price: 2, icon:"iconwater.png"},
];
const binalarStore = [
  {type:"windmill", label:"Değirmen", price: 25, icon:"windmill.png"},
  {type:"oven", label:"Fırın", price: 25, icon:"oven.png"},
  {type:"well", label:"Kuyu", price: 10, icon:"waterwell.png"}
];
let harita = document.getElementById("harita");

// ------- OYUN GİRİŞ EKRANI -------
function splashUpdate() {
  // Kayıt var mı kontrol et
  let kayıt = localStorage.getItem('tarimSave');
  let loadBtn = document.getElementById('loadBtn');
  loadBtn.disabled = !kayıt;
}
function hideSplash() {
  document.getElementById("splash").style.display = "none";
  document.getElementById("game-area").style.display = "";
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

// ------- MÜZİK -----
let musicEl = document.getElementById("gameMusic");
function startMusic() { if(müzikAçık) musicEl.play(); }
function stopMusic() { musicEl.pause(); musicEl.currentTime=0; }
function toggleMusic(val) {
  müzikAçık = val;
  if (müzikAçık) startMusic();
  else stopMusic();
}

// ------- ÜST BAR GÜNCELLE -----
function updateInfoBar() {
  document.getElementById("energyVal").textContent = state.energy;
  document.getElementById("goldVal").textContent = state.gold;
  document.getElementById("diamondVal").textContent = state.diamond || 0;
}

// ------- HARİTA NESNELERİNİ ÇİZ -----
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
  div.style.left = (obj.x) + "vw";
  div.style.top = (obj.y) + "vh";
  div.dataset.id = obj.id;
  div.dataset.tip = tip;
  let img = document.createElement("img");
  if (tip==="tarla") img.src = "assets/images/field.png";
  else if (obj.type==="windmill") img.src = "assets/images/windmill.png";
  else if (obj.type==="oven") img.src = "assets/images/oven.png";
  else if (obj.type==="well") img.src = "assets/images/waterwell.png";
  img.alt = tip;
  div.appendChild(img);
  // Label
  let lbl = document.createElement("div");
  lbl.className = "object-label";
  if (tip==="tarla") lbl.innerText = "Tarla";
  else if (obj.type==="windmill") lbl.innerText = "Değirmen";
  else if (obj.type==="oven") lbl.innerText = "Fırın";
  else if (obj.type==="well") lbl.innerText = "Kuyu";
  div.appendChild(lbl);
  // Tarla tıklama (ekim/hasat/ödül)
  if (tip==="tarla") div.onclick = () => tarlayaTikla(obj.id);
  // Nesne taşımak için uzun bas
  enableDrag(div, obj, tip);
  return div;
}
function tarlayaTikla(id) {
  let obj = state.tarlalar.find(t => t.id === id);
  if (!obj) return;
  if (state.energy < 1) { alert("Enerjin yok!"); return;}
  state.energy--;
  // Rastgele ürün ver:
  let urunler = ["wheat","bread","cookie","flour"];
  let urun = urunler[Math.floor(Math.random()*urunler.length)];
  state[urun]++;
  updateInfoBar();
  drawHarita();
  showFloatingReward(obj.x, obj.y, urun);
}
function showFloatingReward(xvw, yvh, urun) {
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = xvw+"vw";
  div.style.top = (yvh-3)+"vh";
  div.style.zIndex = "30";
  div.style.animation = "fadein .9s";
  div.innerHTML = `<img src="assets/images/icon${urun}.png" style="width:33px;display:block;"><span style="color:#724c11;font-weight:bold;font-size:14px;">+1</span>`;
  harita.appendChild(div);
  setTimeout(()=>div.remove(), 900);
}
// --- Uzun bas-sürükle (long press-drag) ---
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

// ------- BARN / Satış MODAL -------
function openBarn() {
  let modal = document.createElement("div");
  modal.className = "modal-bg";
  let html = `<div class="modal-panel">
    <button class="close-btn" onclick="this.closest('.modal-bg').remove()">&times;</button>
    <h3>Ürünleri Sat</h3>
    <table style="width:98%;margin:0 auto;font-size:15px;">
      <tr><th>Ürün</th><th>Adet</th><th>Birim Fiyat</th><th>Sat</th></tr>`;
  ürünler.forEach(u=>{
    html += `<tr>
      <td><img src="assets/images/${u.icon}" style="width:27px;"> ${u.label}</td>
      <td>${state[u.key]}</td>
      <td><img src="assets/images/icongold.png" style="width:19px;"> ${u.price}</td>
      <td><button onclick="sellProduct('${u.key}',${u.price})" style='padding:2px 9px;border-radius:8px;border:none;background:#ffe083;'>Sat</button></td>
    </tr>`;
  });
  html += `</table></div>`;
  modal.innerHTML = html;
  document.body.appendChild(modal);
}
window.sellProduct = function(key, price) {
  if(state[key]<1) return;
  state[key]--;
  state.gold += price;
  updateInfoBar();
  document.querySelector('.modal-bg').remove();
  openBarn();
}

// ------- STORE / Satın alma -------
function openStore() {
  let modal = document.createElement("div");
  modal.className = "modal-bg";
  let html = `<div class="modal-panel">
    <button class="close-btn" onclick="this.closest('.modal-bg').remove()">&times;</button>
    <h3>Store</h3>
    <div style="margin:6px 0 12px 0;">
      <strong>Tarla satın al:</strong><br>
      <button onclick="buyField()" ${state.tarlalar.length>=state.maxTarlalar?'disabled style="opacity:0.5;"':''}>
        <img src="assets/images/field.png" style="width:28px;vertical-align:middle;"> 
        12 <img src="assets/images/icongold.png" style="width:17px;">
      </button>
      <span style="font-size:13px;color:#906;">(${state.tarlalar.length}/${state.maxTarlalar})</span>
    </div>
    <div style="margin:8px 0 6px 0;">
      <strong>Bina satın al:</strong>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">`;
  binalarStore.forEach(b=>{
    html += `<div style="display:inline-block;">
      <button onclick="buyBuilding('${b.type}',${b.price})" style="padding:6px 9px;border-radius:9px;border:none;background:#ffe083;">
        <img src="assets/images/${b.icon}" style="width:30px;vertical-align:middle;"> 
        ${b.label} <br>
        <img src="assets/images/icongold.png" style="width:15px;">${b.price}
      </button>
    </div>`;
  });
  html += `</div></div></div>`;
  modal.innerHTML = html;
  document.body.appendChild(modal);
}
window.buyField = function() {
  if(state.gold<12 || state.tarlalar.length>=state.maxTarlalar) return;
  state.gold -= 12;
  state.tarlalar.push({id:state.nextId++, x:30+Math.random()*30, y:38+Math.random()*20});
  updateInfoBar(); drawHarita();
  document.querySelector('.modal-bg').remove();
}
window.buyBuilding = function(type, price) {
  if(state.gold<price) return;
  state.gold -= price;
  state.binalar.push({id:state.nextId++, type, x:30+Math.random()*30, y:22+Math.random()*38});
  updateInfoBar(); drawHarita();
  document.querySelector('.modal-bg').remove();
}

// ------- TASKS -------
function openTasks() {
  let modal = document.createElement("div");
  modal.className = "modal-bg";
  let html = `<div class="modal-panel">
    <button class="close-btn" onclick="this.closest('.modal-bg').remove()">&times;</button>
    <h3>Görevler</h3>
    <ul style="padding:0 12px;text-align:left;">
      <li>2 ekmek hasat et (Şu an: <b>${state.bread}</b>)</li>
      <li>3 un sat (<b>${state.flour}</b> sahip)</li>
      <li>En az 3 tarla sahibi ol (Şu an: <b>${state.tarlalar.length}</b>)</li>
      <li>5 altın kazan (<b>${state.gold}</b> altın)</li>
    </ul>
  </div>`;
  modal.innerHTML = html;
  document.body.appendChild(modal);
}

// ------- MAP (sadece bilgi veriyor) -------
function openMap() {
  alert("Harita: Tarlaları ve binaları uzun basıp istediğin yere taşıyabilirsin!");
}

// ------- AYARLAR MODAL -------
document.getElementById("btnSettings").onclick = function() {
  let modal = document.createElement("div");
  modal.className = "modal-bg";
  let html = `<div class="modal-panel">
    <button class="close-btn" onclick="this.closest('.modal-bg').remove()">&times;</button>
    <h3>Ayarlar</h3>
    <div style="margin:17px 0 7px 0;">
      <label style="font-size:16px;">
        <input type="checkbox" id="musicCheck" ${müzikAçık?'checked':''} style="transform:scale(1.3);vertical-align:middle;margin-right:6px;">
        Müzik Açık
      </label>
    </div>
    <button onclick="saveGame()" style="margin-top:12px;padding:8px 27px;font-size:18px;background:#ffdd75;border:none;border-radius:8px;color:#744a0a;font-weight:bold;">Kayıt Et</button>
    <div style="font-size:12px;color:#bb9500;margin-top:7px;">Tüm oyun kaydedilir.</div>
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

// ------- ALT MENÜ -------
document.getElementById("btnBarn").onclick = openBarn;
document.getElementById("btnStore").onclick = openStore;
document.getElementById("btnTasks").onclick = openTasks;
document.getElementById("btnMap").onclick = openMap;

// ------- OYUN BAŞLANGICI -------
function startIfAuto() {
  // otomatik başlama yok, splash ekranında bekle
}
updateInfoBar();
drawHarita();

// ------- Mobil scroll engelle -----
window.addEventListener('touchmove', function(e){ if(e.target.closest('.object')) return; e.preventDefault(); }, { passive:false });

