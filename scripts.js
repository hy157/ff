// --- LOCAL STORAGE ---
function saveGame() {
    let state = {
        coins, energy, maxEnergy, diamonds, musicOn,
        products, tasks, taskRewardCollected, fieldsOwned
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
        updateCoins(coins);
        updateEnergy(energy);
        updateDiamonds(diamonds);
        return true;
    } catch { return false; }
}

// --- GAME STATE ---
let coins = 500;
let energy = 25;
let maxEnergy = 25;
let diamonds = 10;
let musicOn = true;
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

function updateCoins(newVal) {
    coins = newVal;
    coinCountSpan.textContent = coins;
}
function updateEnergy(newVal) {
    energy = Math.max(0, Math.min(maxEnergy, newVal));
    energyCountSpan.textContent = energy + "/" + maxEnergy;
}
function updateDiamonds(newVal) {
    diamonds = newVal;
    diamondCountSpan.textContent = diamonds;
}

// Initial bar values
updateCoins(coins);
updateEnergy(energy);
updateDiamonds(diamonds);

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
    updateCoins(coins); updateEnergy(energy); updateDiamonds(diamonds);
    hideStartMenu();
};

document.getElementById('btnLoad').onclick = () => {
    if (loadGame()) {
        hideStartMenu();
    } else {
        alert("No save found!");
    }
};

// --- MODAL MANAGEMENT ---
function openModal(type) {
    closeModal(); // Remove existing
    let overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    let modal = document.createElement('div');
    modal.className = 'modal-content';

    if (type === 'barn') {
        modal.classList.add('modal-orange');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:28px;">Barn</h2>
            <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin:15px 0;">
                ${Object.entries(products).map(([key, prod]) => `
                    <div style="display:flex;align-items:center;gap:13px;min-width:120px;">
                        <img src="${prod.icon}" alt="" style="width:46px;height:46px;">
                        <span style="font-size:21px;font-weight:bold;">${prod.count}</span>
                        <img src="assets/images/icongold.png" style="width:28px;height:28px;" alt="coin">
                        <span style="font-size:18px;">${prod.value}</span>
                        <button class="sell-btn" data-prod="${key}" style="font-size:15px;padding:7px 15px;background:#fff4c2;color:#b47d12;border-radius:9px;border:none;margin-left:6px;${prod.count===0?'opacity:.35;pointer-events:none;':''}">Sell</button>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (type === 'tasks') {
        modal.classList.add('modal-red');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:28px;">Tasks</h2>
            <div style="margin-top:18px;display:flex;flex-direction:column;gap:17px;">
                ${tasks.map((t, i) => `
                    <div style="display:flex;align-items:center;gap:10px;">
                        <input type="checkbox" disabled ${t.done?'checked':''} style="width:21px;height:21px;">
                        <span style="font-size:18px;">${t.text}</span>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top:22px;text-align:center;">
                <button id="taskRewardBtn" ${(!tasks.every(t=>t.done)||taskRewardCollected)?'disabled':''}
                 style="font-size:19px;border:none;padding:10px 23px;border-radius:15px;
                        background:#fff7c1;color:#b8860b;box-shadow:0 2px 10px #f9dc7e99;display:flex;align-items:center;gap:12px;">
                    <img src="assets/images/icongold.png" style="width:30px;height:30px;">
                    200
                </button>
            </div>
        `;
    } else if (type === 'map') {
        modal.classList.add('modal-orange');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:28px;">Map</h2>
            <div style="font-size:19px;text-align:center;margin-top:28px;">
                Coming soon...
            </div>
        `;
    } else if (type === 'store') {
        modal.classList.add('modal-yellow');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:28px;">Store</h2>
            <div style="display:flex;align-items:center;gap:14px;margin:25px 0 15px 0;">
                <img src="assets/images/field.png" style="width:62px;height:62px;">
                <div>
                    <div style="font-size:21px;font-weight:bold;">Buy Field</div>
                    <div style="display:flex;align-items:center;gap:11px;">
                        <span>50</span>
                        <img src="assets/images/icongold.png" style="width:28px;">
                        <button id="buyFieldBtn" style="font-size:17px;margin-left:14px;background:#ffb647;padding:7px 18px;border-radius:12px;border:none;">Buy</button>
                    </div>
                </div>
            </div>
            <div style="font-size:16px;">Owned fields: <span id="fieldsOwnedSpan">${fieldsOwned}</span></div>
        `;
    } else if (type === 'settings') {
        modal.classList.add('modal-orange');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:28px;text-align:center;">Settings</h2>
            <div style="margin:25px 0 10px 0;display:flex;flex-direction:column;gap:22px;align-items:center;justify-content:center;">
                <button id="musicToggleBtn"
                    style="font-size:22px;padding:12px 44px;background:#ffe3a8;color:#c47b0b;
                    border-radius:15px;border:none;box-shadow:0 2px 10px #f9dc7e77;display:flex;align-items:center;gap:13px;">
                    ${musicOn ? "🎵 Music: ON" : "🔕 Music: OFF"}
                </button>
                <button id="saveGameBtn"
                    style="font-size:21px;padding:10px 36px;background:#fffbe5;color:#875c02;
                    border-radius:13px;border:none;box-shadow:0 2px 10px #fff0ba9a;display:flex;align-items:center;gap:15px;">
                    💾 Save Game
                </button>
            </div>
            <div style="margin-top:16px;text-align:center;color:#aa6e11;font-size:15px;opacity:.75;">
                All your settings are saved automatically.
            </div>
        `;
        setTimeout(()=>{
            document.getElementById('musicToggleBtn').onclick = () => {
                musicOn = !musicOn;
                document.getElementById('musicToggleBtn').textContent =
                    musicOn ? "🎵 Music: ON" : "🔕 Music: OFF";
            };
            document.getElementById('saveGameBtn').onclick = () => {
                saveGame();
                document.getElementById('saveGameBtn').innerHTML = "✅ Saved!";
                setTimeout(()=>{ document.getElementById('saveGameBtn').innerHTML = "💾 Save Game"; }, 1200);
            };
        }, 60);
    }
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Barn: Sell product buttons
    if (type === 'barn') {
        setTimeout(()=>{
            document.querySelectorAll('.sell-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    let prodKey = btn.getAttribute('data-prod');
                    if (products[prodKey] && products[prodKey].count > 0) {
                        let soldAmount = products[prodKey].count;
                        let value = products[prodKey].value;
                        let income = value * soldAmount;
                        products[prodKey].count = 0;
                        flyCoinToBar(income, btn);
                        updateCoins(coins + income);

                        // Task 1: Harvest 1 wheat
                        if (prodKey==='wheat') tasks[0].done = true;
                        // Task 2: Reach 150 coins
                        if (coins + income >= 150) tasks[1].done = true;
                        // Task 3: Sell 3 different products
                        if (Object.values(products).filter(p=>p.count===0 && p.value>0).length>=3) tasks[2].done = true;

                        setTimeout(()=>{ closeModal(); openModal('barn'); }, 500);
                    }
                });
            });
        }, 80);
    }

    // Tasks: Reward button
    if (type === 'tasks') {
        let btn = document.getElementById('taskRewardBtn');
        if (btn) btn.addEventListener('click', function(e) {
            if (!btn.disabled) {
                btn.disabled = true;
                taskRewardCollected = true;
                flyCoinToBar(200, e.target);
                closeModal();
                setTimeout(() => updateCoins(coins + 200), 700);
            }
        });
    }

    // Store: Buy field button
    if (type === 'store') {
        let buyBtn = document.getElementById('buyFieldBtn');
        if (buyBtn) buyBtn.addEventListener('click', function() {
            if (coins >= 50) {
                updateCoins(coins - 50);
                fieldsOwned++;
                document.getElementById('fieldsOwnedSpan').textContent = fieldsOwned;
                flyCoinToBar(50, buyBtn);
            } else {
                buyBtn.textContent = "Not enough!";
                setTimeout(()=>{buyBtn.textContent = "Buy";},900);
            }
        });
    }
}

function closeModal() {
    let overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.remove();
}

// Coin fly animation
function flyCoinToBar(amount, fromElem) {
    let coinBar = document.querySelector('.coin-bar');
    let barRect = coinBar.getBoundingClientRect();
    let fromRect = fromElem.getBoundingClientRect();
    let coin = document.createElement('img');
    coin.src = 'assets/images/icongold.png';
    coin.style.position = 'fixed';
    coin.style.left = fromRect.left + 'px';
    coin.style.top = fromRect.top + 'px';
    coin.style.width = '38px';
    coin.style.height = '38px';
    coin.style.transition = 'all 0.7s cubic-bezier(.77,-0.25,.17,1.2)';
    coin.style.zIndex = 100;
    document.body.appendChild(coin);
    setTimeout(()=>{
        coin.style.left = (barRect.left+25) + 'px';
        coin.style.top = (barRect.top+10) + 'px';
        coin.style.width = '22px';
        coin.style.height = '22px';
        coin.style.opacity = '0.33';
    }, 30);
    setTimeout(()=>{ coin.remove(); }, 750);
}

// --- BUTTON EVENTS ---
document.getElementById('btnBarn').addEventListener('click', ()=>openModal('barn'));
document.getElementById('btnTasks').addEventListener('click', ()=>openModal('tasks'));
document.getElementById('btnMap').addEventListener('click', ()=>openModal('map'));
document.getElementById('btnStore').addEventListener('click', ()=>openModal('store'));
document.getElementById('btnSettings').addEventListener('click', ()=>openModal('settings'));

// --- GAME CANVAS MULTI-TOUCH DEMO ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let touches = {};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

function handleTouch(evt) {
    evt.preventDefault();
    touches = {};
    for (let i = 0; i < evt.touches.length; i++) {
        let t = evt.touches[i];
        touches[t.identifier] = { x: t.clientX, y: t.clientY };
    }
}
function handleTouchEnd(evt) {
    evt.preventDefault();
    touches = {};
    for (let i = 0; i < evt.touches.length; i++) {
        let t = evt.touches[i];
        touches[t.identifier] = { x: t.clientX, y: t.clientY };
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.values(touches).forEach(t => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 40, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ff9900';
        ctx.stroke();
    });
    requestAnimationFrame(draw);
}
draw();

window.closeModal = closeModal;
