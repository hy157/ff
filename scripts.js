// Oyun verileri
let coins = 500;
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

// UI
const coinCountSpan = document.getElementById('coinCount');
function updateCoins(newVal) {
    coins = newVal;
    coinCountSpan.textContent = coins;
}

// Modal fonksiyonları
function openModal(type) {
    closeModal(); // Açık modal varsa önce kapat
    let overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    let modal = document.createElement('div');
    modal.className = 'modal-content';

    // Pencere tipi ve içerik
    if (type === 'barn') {
        modal.classList.add('modal-orange');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:20px;">Barn</h2>
            <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:12px 0;">
                ${Object.entries(products).map(([key, prod]) => `
                    <div style="display:flex;align-items:center;gap:8px;min-width:90px;">
                        <img src="${prod.icon}" alt="" style="width:32px;height:32px;">
                        <span style="font-size:17px;font-weight:bold;">${prod.count}</span>
                        <img src="assets/images/icongold.png" style="width:20px;height:20px;" alt="coin">
                        <span style="font-size:15px;">${prod.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (type === 'tasks') {
        modal.classList.add('modal-red');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:20px;">Tasks</h2>
            <div style="margin-top:12px;display:flex;flex-direction:column;gap:13px;">
                ${tasks.map((t, i) => `
                    <div style="display:flex;align-items:center;gap:8px;">
                        <input type="checkbox" disabled ${t.done?'checked':''} style="width:18px;height:18px;">
                        <span style="font-size:16px;">${t.text}</span>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top:18px;text-align:center;">
                <button id="taskRewardBtn" ${(!tasks.every(t=>t.done)||taskRewardCollected)?'disabled':''}
                 style="font-size:17px;border:none;padding:8px 18px;border-radius:14px;
                        background:#fff7c1;color:#b8860b;box-shadow:0 2px 8px #f9dc7e77;display:flex;align-items:center;gap:9px;">
                    <img src="assets/images/icongold.png" style="width:22px;height:22px;">
                    200
                </button>
            </div>
        `;
    } else if (type === 'map') {
        modal.classList.add('modal-orange');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:20px;">Map</h2>
            <div style="font-size:16px;text-align:center;margin-top:18px;">
                Coming soon...
            </div>
        `;
    } else if (type === 'store') {
        modal.classList.add('modal-yellow');
        modal.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✖️</button>
            <h2 style="margin-top:0;font-size:20px;">Store</h2>
            <div style="display:flex;align-items:center;gap:12px;margin:22px 0 9px 0;">
                <img src="assets/images/field.png" style="width:48px;height:48px;">
                <div>
                    <div style="font-size:17px;font-weight:bold;">Buy Field</div>
                    <div style="display:flex;align-items:center;gap:7px;">
                        <span>50</span>
                        <img src="assets/images/icongold.png" style="width:20px;">
                        <button id="buyFieldBtn" style="font-size:15px;margin-left:10px;background:#ffb647;padding:4px 12px;border-radius:8px;border:none;">Buy</button>
                    </div>
                </div>
            </div>
            <div style="font-size:15px;">Owned fields: <span id="fieldsOwnedSpan">${fieldsOwned}</span></div>
        `;
    }
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Görev ödül butonu animasyonu ve fonksiyonu
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

    // Store butonu satın al fonksiyonu
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

// Animasyon: coin uçuşu
function flyCoinToBar(amount, fromElem) {
    // Coin bar pozisyonunu bul
    let coinBar = document.querySelector('.coin-bar');
    let barRect = coinBar.getBoundingClientRect();
    // Kaynağın pozisyonunu bul
    let fromRect = fromElem.getBoundingClientRect();
    // Coin ikonunu oluştur
    let coin = document.createElement('img');
    coin.src = 'assets/images/icongold.png';
    coin.style.position = 'fixed';
    coin.style.left = fromRect.left + 'px';
    coin.style.top = fromRect.top + 'px';
    coin.style.width = '32px';
    coin.style.height = '32px';
    coin.style.transition = 'all 0.7s cubic-bezier(.77,-0.25,.17,1.2)';
    coin.style.zIndex = 100;
    document.body.appendChild(coin);
    setTimeout(()=>{
        coin.style.left = (barRect.left+18) + 'px';
        coin.style.top = (barRect.top+7) + 'px';
        coin.style.width = '16px';
        coin.style.height = '16px';
        coin.style.opacity = '0.33';
    }, 30);
    setTimeout(()=>{ coin.remove(); }, 750);
}

// Butonlara tıklama eventleri
document.getElementById('btnBarn').addEventListener('click', ()=>openModal('barn'));
document.getElementById('btnTasks').addEventListener('click', ()=>openModal('tasks'));
document.getElementById('btnMap').addEventListener('click', ()=>openModal('map'));
document.getElementById('btnStore').addEventListener('click', ()=>openModal('store'));

// Oyun ekranı için eski dokunmatik desteği aynen bırakıyoruz
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

// Modal çarpı butonları window’dan ulaşsın diye:
window.closeModal = closeModal;
