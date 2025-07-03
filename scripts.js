let defaultState = {
  energy: 1000,
  gold: 1000,
  diamond: 0,
  wheat: 0,
  bread: 0,
  cookie: 0,
  flour: 0,
  water: 0,
  tarlalar: [],
  binalar: [],
  nextId: 1,
  maxTarlalar: 4
};
let state = JSON.parse(JSON.stringify(defaultState));
let müzikAçık = true;
const ürünler = [
  {key:"wheat", label:"Buğday", price: 3, icon:"iconwheat.png"}
];
const binalarStore = [
  {type:"windmill", label:"Değirmen", price: 25, icon:"windmill.png"},
  {type:"oven", label:"Fırın", price: 25, icon:"oven.png"},
  {type:"well", label:"Kuyu", price: 10, icon:"waterwell.png"}
];
let harita = document.getElementById("harita");

// ------- AÇILIŞ EKRANI -------
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

// Tarla görseli ve menü
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
    // Tarla aşamasına göre resmi seç:
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

    // Tarla yazısı yok!

    // Tıklayınca menü aç
    div.onclick = (e) => {
      e.stopPropagation();
      showFieldMenu(obj, div);
    };
  } else {
    if (obj.type === "windmill") img.src = "assets/images/windmill.png";
    else if (obj.type === "oven") img.src = "assets/images/oven.png";
    else if (obj.type === "well") img.src = "assets/images/waterwell.png";
    img.alt = tip;
    img.style.width = "28vw";
    img.style.maxWidth = "128px";
    img.style.minWidth = "70px";
    div.appendChild(img);
  }

  enableDrag(div, obj, tip);
  return div;
}

// Tarla üstü menü
function showFieldMenu(tarlaObj, parentDiv) {
  // Zaten açıksa tekrar açmasın
  if (document.getElementById("field-menu")) return;

  let menu = document.createElement("div");
  menu.id = "field-menu";
  menu.style.left = parentDiv.style.left;
  menu.style.top = `calc(${parentDiv.style.top} - 13vw)`;
  // Menü: ekim ya da hasat
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

  // Dışarı tıkla menüyü kapat
  setTimeout(()=>{
    document.body.addEventListener("touchstart", removeFieldMenu, {once:true});
    document.body.addEventListener("mousedown", removeFieldMenu, {once:true});
  },50);
  function removeFieldMenu(e) {
    if (e && e.target === menu) return;
    menu.remove();
  }
}

// Ekim fonksiyonu
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

// Tarla gelişimi
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

// Hasat fonksiyonu + animasyon
function harvestField(tarlaObj, parentDiv) {
  tarlaObj.state = "empty";
  tarlaObj.growth = 0;
  animateWheatAndCoin(parentDiv);
  state.wheat += 2;
  state.gold += 2;
  updateInfoBar();
  drawHarita();
}

// Hasat animasyonu
function animateWheatAndCoin(parentDiv) {
  // Wheat animasyonu
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

  // Coin animasyonu
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

// ------- BARN, STORE, TASKS, MAP, AYARLAR (eski şekilde devam ediyor, istersen sadeleştiririz) -------
// ... (Buraya eski kodun aynı şekilde devam edebilir.)

// ALT MENÜ
document.getElementById("btnBarn").onclick = openBarn;
document.getElementById("btnStore").onclick = openStore;
document.getElementById("btnTasks").onclick = openTasks;
document.getElementById("btnMap").onclick = openMap;
document.getElementById("btnSettings").onclick = openSettings;

function openBarn() { alert("Barn: Ürün satışı ve stokları burada görebilirsin."); }
function openStore() { alert("Store: Tarla ve bina satın alma burada."); }
function openTasks() { alert("Görevler: Çok yakında!"); }
function openMap() { alert("Harita: Tarlaları ve binaları taşıyabilirsin."); }
function openSettings() {
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

// Mobil scroll engelle
window.addEventListener('touchmove', function(e){ if(e.target.closest('.object')) return; e.preventDefault(); }, { passive:false });

// Başlangıç barlarını güncelle
updateInfoBar();
drawHarita();
