// --- LOCAL STORAGE ---
function saveGame() {
    let state = {
        coins, energy, maxEnergy, diamonds, musicOn,
        products, tasks, taskRewardCollected, fieldsOwned,
        fields, buildings
    };
    localStorage.setItem("farmgame_save", JSON.stringify(state));
}
function loadGame() {
    let state = localStorage.getItem("farmgame_save");
    if (!state) return false;
    try {
        state = JSON.parse(state);
        coins = state.coins ?? 500;
        energy = state.energy ?? 25;
        maxEnergy = state.maxEnergy ?? 25;
        diamonds = state.diamonds ?? 10;
        musicOn = state.musicOn ?? true;
        products = state.products ?? products;
        tasks = state.tasks ?? tasks;
        taskRewardCollected = state.taskRewardCollected ?? false;
        fieldsOwned = state.fieldsOwned ?? 1;
        if(state.fields) fields = state.fields;
        if(state.buildings) buildings = state.buildings;
        updateCoins(coins);
        updateEnergy(energy);
        updateDiamonds(diamonds);
        return true;
    } catch { return false; }
}
// --- GAME STATE ---
let coins = 500, energy = 25, maxEnergy = 25, diamonds = 10, musicOn = true;
let products = {
    wheat: { icon: 'assets/images/iconwheat.png', count: 13, value: 5 },
    water: { icon: 'assets/images/iconwater.png', count: 8, value: 7 },
    flour: { icon: 'assets/images/iconflour.png', count: 4, value: 10 },
    bread: { icon: 'assets/images/iconbread.png', count: 2, value: 30 },
    eurokuro: { icon: 'assets/images/iconeurokuro.png', count: 0, value: 60 },
    cookie: { icon: 'assets/images/iconcookie.png', count: 0, value: 100 }
};
let tasks = [
    { text: "Harvest 1 wheat", done: false },
    { text: "Reach 150 coins", done: false },
    { text: "Sell 3 different products", done: false }
];
let taskRewardCollected = false;
let fieldsOwned = 1;

// --- UI BARS ---
const coinCountSpan = document.getElementById('coinCount');
const energyCountSpan = document.getElementById('energyCount');
const diamondCountSpan = document.getElementById('diamondCount');
function updateCoins(newVal) { coins = newVal; coinCountSpan.textContent = coins; }
function updateEnergy(newVal) { energy = Math.max(0, Math.min(maxEnergy, newVal)); energyCountSpan.textContent = energy + "/" + maxEnergy; }
function updateDiamonds(newVal) { diamonds = newVal; diamondCountSpan.textContent = diamonds; }
updateCoins(coins); updateEnergy(energy); updateDiamonds(diamonds);

// --- START MENU FUNCTIONS ---
function showStartMenu() {
    document.getElementById('gameStartMenu').style.display = "flex";
    document.querySelector('.top-bars').style.display = "none";
    document.querySelector('.bottom-bar').style.display = "none";
}
function hideStartMenu() {
    document.getElementById('gameStartMenu').style.display = "none";
    document.querySelector('.top-bars').style.display = "";
    document.querySelector('.bottom-bar').style.display = "";
}
// Show start menu at load
window.onload = function() { showStartMenu(); }
// Start menu buttons
document.getElementById('btnPlay').onclick = () => {
    coins = 500; energy = 25; maxEnergy = 25; diamonds = 10; musicOn = true;
    products = {
        wheat: { icon: 'assets/images/iconwheat.png', count: 13, value: 5 },
        water: { icon: 'assets/images/iconwater.png', count: 8, value: 7 },
        flour: { icon: 'assets/images/iconflour.png', count: 4, value: 10 },
        bread: { icon: 'assets/images/iconbread.png', count: 2, value: 30 },
        eurokuro: { icon: 'assets/images/iconeurokuro.png', count: 0, value: 60 },
        cookie: { icon: 'assets/images/iconcookie.png', count: 0, value: 100 }
    };
    tasks = [
        { text: "Harvest 1 wheat", done: false },
        { text: "Reach 150 coins", done: false },
        { text: "Sell 3 different products", done: false }
    ];
    taskRewardCollected = false;
    fieldsOwned = 1;
    if(typeof spawnInitialBuildingsAndField === 'function') spawnInitialBuildingsAndField();
    updateCoins(coins); updateEnergy(energy); updateDiamonds(diamonds);
    hideStartMenu();
};
document.getElementById('btnLoad').onclick = () => { if (loadGame()) { hideStartMenu(); } else { alert("No save found!"); } };

// --- MODAL MANAGEMENT --- (TAM STORE MODALI ENTEGRE)
function openModal(type) {
    closeModal();
    let overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    let modal = document.createElement('div');
    modal.className = 'modal-content';

    // -- STORE MODAL (tam entegre) --
    if (type === 'store') {
        modal.classList.add('modal-yellow');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:28px;">Store</h2>
            <div style="display:flex;flex-direction:column;gap:18px;align-items:center;margin:15px 0;">
                <div style="display:flex;align-items:center;gap:14px;">
                    <img src="assets/images/field.png" style="width:58px;height:58px;">
                    <div>
                        <div style="font-size:21px;font-weight:bold;">Buy Field</div>
                        <div style="display:flex;align-items:center;gap:11px;">
                            <span>50</span>
                            <img src="assets/images/icongold.png" style="width:24px;">
                            <button id="buyFieldBtn" style="font-size:16px;margin-left:12px;background:#ffb647;padding:5px 16px;border-radius:12px;border:none;">Buy</button>
                        </div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:14px;">
                    <img src="assets/images/oven.png" style="width:58px;height:58px;filter:${buildings.find(b=>b.type==='oven').owned?'grayscale(1) opacity(.5)':''}">
                    <div>
                        <div style="font-size:21px;font-weight:bold;">Buy Oven</div>
                        <div style="display:flex;align-items:center;gap:11px;">
                            <span>200</span>
                            <img src="assets/images/icongold.png" style="width:24px;">
                            <button id="buyOvenBtn" ${buildings.find(b=>b.type==='oven').owned?'disabled':''} style="font-size:16px;margin-left:12px;background:#ffb647;padding:5px 16px;border-radius:12px;border:none;opacity:${buildings.find(b=>b.type==='oven').owned?'.4':'1'};cursor:${buildings.find(b=>b.type==='oven').owned?'not-allowed':'pointer'};">${buildings.find(b=>b.type==='oven').owned?'Owned':'Buy'}</button>
                        </div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:14px;">
                    <img src="assets/images/waterwell.png" style="width:58px;height:58px;filter:${buildings.find(b=>b.type==='waterwell').owned?'grayscale(1) opacity(.5)':''}">
                    <div>
                        <div style="font-size:21px;font-weight:bold;">Buy Water Well</div>
                        <div style="display:flex;align-items:center;gap:11px;">
                            <span>100</span>
                            <img src="assets/images/icongold.png" style="width:24px;">
                            <button id="buyWaterwellBtn" ${buildings.find(b=>b.type==='waterwell').owned?'disabled':''} style="font-size:16px;margin-left:12px;background:#ffb647;padding:5px 16px;border-radius:12px;border:none;opacity:${buildings.find(b=>b.type==='waterwell').owned?'.4':'1'};cursor:${buildings.find(b=>b.type==='waterwell').owned?'not-allowed':'pointer'};">${buildings.find(b=>b.type==='waterwell').owned?'Owned':'Buy'}</button>
                        </div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:14px;">
                    <img src="assets/images/windmill.png" style="width:58px;height:58px;filter:${buildings.find(b=>b.type==='windmill').owned?'grayscale(1) opacity(.5)':''}">
                    <div>
                        <div style="font-size:21px;font-weight:bold;">Buy Windmill</div>
                        <div style="display:flex;align-items:center;gap:11px;">
                            <span>150</span>
                            <img src="assets/images/icongold.png" style="width:24px;">
                            <button id="buyWindmillBtn" ${buildings.find(b=>b.type==='windmill').owned?'disabled':''} style="font-size:16px;margin-left:12px;background:#ffb647;padding:5px 16px;border-radius:12px;border:none;opacity:${buildings.find(b=>b.type==='windmill').owned?'.4':'1'};cursor:${buildings.find(b=>b.type==='windmill').owned?'not-allowed':'pointer'};">${buildings.find(b=>b.type==='windmill').owned?'Owned':'Buy'}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style="font-size:16px;">Owned fields: <span id="fieldsOwnedSpan">${fieldsOwned}</span></div>
        `;

        setTimeout(()=>{
            let buyBtn = document.getElementById('buyFieldBtn');
            if (buyBtn) buyBtn.addEventListener('click', function() {
                if (coins >= 50) {
                    updateCoins(coins - 50);
                    fieldsOwned++;
                    document.getElementById('fieldsOwnedSpan').textContent = fieldsOwned;
                    if(typeof fields !== "undefined"){
                        fields.push({
                            x: (window.innerWidth / 2) - 80,
                            y: (window.innerHeight / 2) - 55,
                            state: 0, timer: 0, progress: 0, dragging: false
                        });
                    }
                    flyCoinToBar(50, buyBtn);
                } else {
                    buyBtn.textContent = "Not enough!";
                    setTimeout(()=>{buyBtn.textContent = "Buy";},900);
                }
            });
            let ovenBtn = document.getElementById('buyOvenBtn');
            if(ovenBtn) ovenBtn.addEventListener('click', function() {
                let oven = buildings.find(b=>b.type==='oven');
                if (oven.owned) return;
                if (coins >= 200) {
                    updateCoins(coins - 200);
                    oven.owned = true;
                    openModal('store');
                } else {
                    ovenBtn.textContent = "Not enough!";
                    setTimeout(()=>{ovenBtn.textContent = "Buy";},900);
                }
            });
            let waterwellBtn = document.getElementById('buyWaterwellBtn');
            if(waterwellBtn) waterwellBtn.addEventListener('click', function() {
                let w = buildings.find(b=>b.type==='waterwell');
                if (w.owned) return;
                if (coins >= 100) {
                    updateCoins(coins - 100);
                    w.owned = true;
                    openModal('store');
                } else {
                    waterwellBtn.textContent = "Not enough!";
                    setTimeout(()=>{waterwellBtn.textContent = "Buy";},900);
                }
            });
            let windmillBtn = document.getElementById('buyWindmillBtn');
            if(windmillBtn) windmillBtn.addEventListener('click', function() {
                let w = buildings.find(b=>b.type==='windmill');
                if (w.owned) return;
                if (coins >= 150) {
                    updateCoins(coins - 150);
                    w.owned = true;
                    openModal('store');
                } else {
                    windmillBtn.textContent = "Not enough!";
                    setTimeout(()=>{windmillBtn.textContent = "Buy";},900);
                }
            });
        }, 60);
    }
    // ... (diğer modallar aynı kalır)
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
function closeModal() {
    let overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.remove();
}
// ... (flyCoinToBar, buton eventleri, canvas resize, touch fonksiyonları yukarıda verdiğim gibi)
// Bütün openModal fonksiyonları burada olmalı.
document.getElementById('btnBarn').addEventListener('click', ()=>openModal('barn'));
document.getElementById('btnTasks').addEventListener('click', ()=>openModal('tasks'));
document.getElementById('btnMap').addEventListener('click', ()=>openModal('map'));
document.getElementById('btnStore').addEventListener('click', ()=>openModal('store'));
document.getElementById('btnSettings').addEventListener('click', ()=>openModal('settings'));
// --- GAME CANVAS MULTI-TOUCH DEMO ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let touches = {};
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight;}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
function handleTouch(evt) { evt.preventDefault(); touches = {}; for (let i = 0; i < evt.touches.length; i++) { let t = evt.touches[i]; touches[t.identifier] = { x: t.clientX, y: t.clientY };}}
function handleTouchEnd(evt) { evt.preventDefault(); touches = {}; for (let i = 0; i < evt.touches.length; i++) { let t = evt.touches[i]; touches[t.identifier] = { x: t.clientX, y: t.clientY };}}
function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height); Object.values(touches).forEach(t => { ctx.beginPath(); ctx.arc(t.x, t.y, 40, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#ff9900'; ctx.stroke(); }); requestAnimationFrame(draw);}
draw();
window.closeModal = closeModal;
