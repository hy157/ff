// Görsel yolları
const fieldStates = [
    "assets/images/field.png",           // 0: empty
    "assets/images/fieldfide.png",       // 1: sprouts (7s)
    "assets/images/fieldgreenwheat.png", // 2: green wheat (8s)
    "assets/images/fieldwheatrh.png"     // 3: harvest ready
];

const buildingDefs = {
    oven:     { img: "assets/images/oven.png", x: 120,  y: 300, price: 200 },
    waterwell:{ img: "assets/images/waterwell.png", x: 220, y: 170, price: 100 },
    windmill: { img: "assets/images/windmill.png", x: 60,   y: 130, price: 150 }
};

// --- GLOBAL STATE (scripts.js ile ortak olacak şekilde)
window.fields = window.fields || [];
window.buildings = window.buildings || [];

// --- SPAWN BAŞLANGIÇTA (ve yeni oyun başlatınca) ---
function spawnInitialBuildingsAndField() {
    fields.length = 0;
    let right = window.innerWidth - 200;
    let bottom = window.innerHeight - 220;
    fields.push({ x: right, y: bottom, state: 0, timer: 0, progress: 0, dragging: false });
    buildings.length = 0;
    buildings.push(
        { type: "oven", owned: false, ...buildingDefs.oven, dragging: false, level: 1, timer: 0 },
        { type: "waterwell", owned: false, ...buildingDefs.waterwell, dragging: false, level: 1, produced: 0, timer: 0, lastTick: 0 },
        { type: "windmill", owned: false, ...buildingDefs.windmill, dragging: false, level: 1, timer: 0 }
    );
}
window.spawnInitialBuildingsAndField = spawnInitialBuildingsAndField;

window.addEventListener("DOMContentLoaded", () => { spawnInitialBuildingsAndField(); });

window.addEventListener('resize', () => {
    // İlk tarlanın sağ alt köşede kalmasını istersek:
    if(fields[0]) {
        fields[0].x = window.innerWidth - 200;
        fields[0].y = window.innerHeight - 220;
    }
});

// --- DRAG & DROP + TOUCH ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let draggingObj = null, dragOffset = {x:0, y:0};
let dragTimer = null, dragStartXY = null;

canvas.addEventListener('touchstart', canvasTouchStart, { passive: false });
canvas.addEventListener('touchmove',  canvasTouchMove,  { passive: false });
canvas.addEventListener('touchend',   canvasTouchEnd,   { passive: false });

function isPointInObj(x, y, obj, w=160, h=110) {
    return x >= obj.x && x <= obj.x + w && y >= obj.y && y <= obj.y + h;
}

function canvasTouchStart(e) {
    let rect = canvas.getBoundingClientRect();
    let tx = e.touches[0].clientX - rect.left;
    let ty = e.touches[0].clientY - rect.top;
    draggingObj = null;
    dragStartXY = {x: tx, y: ty};
    dragTimer = setTimeout(() => {
        let found = false;
        fields.forEach(field => {
            if (isPointInObj(tx, ty, field)) {
                draggingObj = field;
                dragOffset.x = tx - field.x;
                dragOffset.y = ty - field.y;
                field.dragging = true;
                found = true;
            }
        });
        if (!found) {
            buildings.forEach(build => {
                let wh = build.type === "windmill" ? [160,160] : [130,130];
                if (isPointInObj(tx, ty, build, ...wh)) {
                    draggingObj = build;
                    dragOffset.x = tx - build.x;
                    dragOffset.y = ty - build.y;
                    build.dragging = true;
                }
            });
        }
    }, 350);
}

function canvasTouchMove(e) {
    if (!draggingObj) return;
    let rect = canvas.getBoundingClientRect();
    let tx = e.touches[0].clientX - rect.left;
    let ty = e.touches[0].clientY - rect.top;
    draggingObj.x = tx - dragOffset.x;
    draggingObj.y = ty - dragOffset.y;
}

function canvasTouchEnd(e) {
    if (dragTimer) clearTimeout(dragTimer);
    if (draggingObj) {
        draggingObj.dragging = false;
        draggingObj = null;
    }
}

// --- TIKLAMA ---(Uzun dokunuş değilse açılır!)
canvas.addEventListener('touchstart', (e) => {
    if (draggingObj) return;
    let rect = canvas.getBoundingClientRect();
    let tx = e.touches[0].clientX - rect.left;
    let ty = e.touches[0].clientY - rect.top;
    let clickedField = null;
    fields.forEach(field => { if (isPointInObj(tx, ty, field)) clickedField = field; });
    if (clickedField) { setTimeout(()=>openFieldPopup(clickedField), 70); return; }
    let clickedBuild = null;
    buildings.forEach(build => {
        let wh = build.type === "windmill" ? [160,160] : [130,130];
        if (isPointInObj(tx, ty, build, ...wh)) clickedBuild = build;
    });
    if (clickedBuild) { setTimeout(()=>openBuildingPopup(clickedBuild), 70); return; }
}, { passive: false });

// --- FIELD POPUP ---
function openFieldPopup(field) {
    closeFieldPopup();
    let popup = document.createElement("div");
    popup.id = "fieldPopup";
    popup.style.position = "fixed";
    popup.style.left = (field.x + 70) + "px";
    popup.style.top  = (field.y - 58) + "px";
    popup.style.background = "#fffbe9";
    popup.style.borderRadius = "16px";
    popup.style.boxShadow = "0 2px 12px #cfa84777";
    popup.style.padding = "12px 13px";
    popup.style.zIndex = 1000;
    popup.style.display = "flex";
    popup.style.gap = "12px";
    // Seed Button
    let seedBtn = document.createElement("img");
    seedBtn.src = "assets/images/iconseed.png";
    seedBtn.style.width = "38px";
    seedBtn.style.height = "38px";
    seedBtn.style.filter = field.state !== 0 ? "grayscale(1) brightness(1.2)" : "";
    seedBtn.style.opacity = field.state !== 0 ? "0.5" : "1.0";
    seedBtn.style.cursor = field.state === 0 ? "pointer" : "not-allowed";
    seedBtn.onclick = function(){
        if (field.state !== 0) return;
        if (typeof coins === "undefined" || typeof energy === "undefined") return;
        if (coins < 1 || energy < 1) return;
        // Ekim animasyonu & işlem
        if(typeof updateCoins==="function") updateCoins(coins-1);
        if(typeof updateEnergy==="function") updateEnergy(energy-1);
        flyToObject("assets/images/icongold.png", field.x+65, field.y+50, ".coin-bar");
        flyToObject("assets/images/iconenergy.png", field.x+105, field.y+68, ".energy-bar");
        field.state = 1; field.timer = Date.now(); field.progress = 0;
        closeFieldPopup();
    };
    // Sickle Button
    let sickleBtn = document.createElement("img");
    sickleBtn.src = "assets/images/iconsickle.png";
    sickleBtn.style.width = "38px";
    sickleBtn.style.height = "38px";
    let harvestable = field.state === 3;
    sickleBtn.style.filter = harvestable ? "" : "grayscale(1) brightness(1.2)";
    sickleBtn.style.opacity = harvestable ? "1.0" : "0.45";
    sickleBtn.style.cursor = harvestable ? "pointer" : "not-allowed";
    sickleBtn.onclick = function(){
        if (!harvestable) return;
        if (typeof energy === "undefined" || energy < 1) return;
        if(typeof updateEnergy==="function") updateEnergy(energy-1);
        flyToObject("assets/images/iconenergy.png", field.x+105, field.y+68, ".energy-bar");
        flyToObject("assets/images/iconwheat.png", field.x+90, field.y+40, "#btnBarn");
        if(typeof products!=="undefined" && products.wheat) products.wheat.count += 1;
        field.state = 0; field.timer = 0; field.progress = 0;
        closeFieldPopup();
    };
    popup.appendChild(seedBtn);
    popup.appendChild(sickleBtn);
    document.body.appendChild(popup);
    setTimeout(() => {
        document.addEventListener("mousedown", closeFieldPopup, {once:true});
        document.addEventListener("touchstart", closeFieldPopup, {once:true});
    }, 40);
}
function closeFieldPopup() {
    let p = document.getElementById("fieldPopup");
    if (p) p.remove();
    let b = document.getElementById("buildingPopup");
    if (b) b.remove();
}

// --- BUILDING POPUP ---
function openBuildingPopup(build) {
    closeFieldPopup();
    let popup = document.createElement("div");
    popup.id = "buildingPopup";
    popup.style.position = "fixed";
    popup.style.left = (build.x + 30) + "px";
    popup.style.top  = (build.y - 70) + "px";
    popup.style.background = "#fffbe9";
    popup.style.borderRadius = "16px";
    popup.style.boxShadow = "0 2px 12px #cfa84777";
    popup.style.padding = "15px 19px";
    popup.style.zIndex = 1000;
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    popup.style.alignItems = "center";
    if (!build.owned) {
        let img = document.createElement("img");
        img.src = build.img;
        img.style.width = "64px";
        img.style.filter = "grayscale(1) opacity(.7)";
        popup.appendChild(img);
        let price = document.createElement("div");
        price.innerHTML = `<img src="assets/images/icongold.png" style="width:22px;vertical-align:middle;"> <span style="font-size:22px;">${build.price}</span>`;
        popup.appendChild(price);
        let buyBtn = document.createElement("button");
        buyBtn.innerHTML = "Buy";
        buyBtn.style.marginTop = "11px";
        buyBtn.style.background = "#ffb647";
        buyBtn.style.borderRadius = "10px";
        buyBtn.style.border = "none";
        buyBtn.style.fontSize = "19px";
        buyBtn.style.padding = "7px 26px";
        buyBtn.onclick = function(){
            if (typeof coins === "undefined" || coins < build.price) return;
            if(typeof updateCoins==="function") updateCoins(coins-build.price);
            build.owned = true;
            closeFieldPopup();
        };
        popup.appendChild(buyBtn);
    } else {
        // Waterwell upgrade & toplama
        if (build.type === "waterwell") {
            popup.innerHTML = `<b>Water Well (Lv${build.level})</b>
            <div style="margin:6px 0 10px 0">Water: ${build.produced}/10</div>
            <div id="waterwellTimer" style="font-size:16px;color:#1a6eaa"></div>`;
            let collectBtn = document.createElement("button");
            collectBtn.textContent = "Collect Water";
            collectBtn.style.marginTop = "9px";
            collectBtn.onclick = function() {
                let add = Math.min(build.produced, 10);
                if(typeof products!=="undefined" && products.water) products.water.count += add;
                build.produced -= add;
                closeFieldPopup();
            };
            popup.appendChild(collectBtn);
            if (build.level < 3) {
                let upgBtn = document.createElement("button");
                upgBtn.textContent = "Upgrade ("+(build.level==1?125:175)+"🪙)";
                upgBtn.style.marginTop = "6px";
                upgBtn.onclick = function() {
                    let cost = build.level==1?125:175;
                    if (typeof coins === "undefined" || coins < cost) return;
                    if(typeof updateCoins==="function") updateCoins(coins-cost);
                    build.level++;
                    closeFieldPopup();
                };
                popup.appendChild(upgBtn);
            }
        }
        // Diğer bina (windmill, oven) fonksiyonlarını aynı mantıkla ekleyebilirsin.
    }
    document.body.appendChild(popup);
    setTimeout(() => {
        document.addEventListener("mousedown", closeFieldPopup, {once:true});
        document.addEventListener("touchstart", closeFieldPopup, {once:true});
    }, 40);
}

// --- ANİMASYONLAR ---
function flyToObject(imgSrc, fromX, fromY, toSelector) {
    let toElem = document.querySelector(toSelector);
    if (!toElem) return;
    let rect = toElem.getBoundingClientRect();
    let coin = document.createElement('img');
    coin.src = imgSrc;
    coin.style.position = 'fixed';
    coin.style.left = fromX + 'px';
    coin.style.top = fromY + 'px';
    coin.style.width = '32px';
    coin.style.height = '32px';
    coin.style.transition = 'all 0.8s cubic-bezier(.77,-0.25,.17,1.2)';
    coin.style.zIndex = 10000;
    document.body.appendChild(coin);
    setTimeout(()=>{
        coin.style.left = (rect.left+25) + 'px';
        coin.style.top = (rect.top+10) + 'px';
        coin.style.width = '18px';
        coin.style.height = '18px';
        coin.style.opacity = '0.33';
    }, 30);
    setTimeout(()=>{ coin.remove(); }, 850);
}

// --- GAME LOOP: Tarla büyütme ve bina sayaçları ---
function buildingsLoop() {
    // Tarla büyüme
    fields.forEach(field => {
        if (field.state >= 1) {
            let elapsed = (Date.now() - field.timer) / 1000;
            if (field.state == 1 && elapsed > 7) { field.state = 2; }
            if (field.state == 2 && elapsed > 15) { field.state = 3; }
            if (field.state == 3) elapsed = 15;
            field.progress = elapsed;
        }
    });
    // Waterwell üretim
    buildings.forEach(build => {
        if (build.type === "waterwell" && build.owned) {
            let maxCap = 10, tick = [30, 15, 15][build.level-1], amount = [1,1,3][build.level-1];
            if (build.produced < maxCap) {
                if (!build.lastTick) build.lastTick = Date.now();
                let diff = (Date.now() - build.lastTick)/1000;
                if (diff > tick) {
                    build.produced = Math.min(maxCap, build.produced + amount);
                    build.lastTick = Date.now();
                }
            }
        }
        // Diğer binalar burada geliştirilebilir.
    });
    // CANVAS ÇİZİM
    drawBuildings();
    requestAnimationFrame(buildingsLoop);
}
requestAnimationFrame(buildingsLoop);

// --- CANVAS ÇİZİM ---
function drawBuildings() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Fields
    fields.forEach(field => {
        let img = new window.Image();
        img.src = fieldStates[field.state];
        ctx.drawImage(img, field.x, field.y, 160, 110);
        // Timer barı
        if (field.state >= 1 && field.state < 3) {
            let elapsed = field.progress;
            let barW = 90, barH = 10;
            ctx.fillStyle = "#f8e28e";
            ctx.fillRect(field.x+55, field.y+10, barW, barH);
            ctx.fillStyle = "#b8a537";
            ctx.fillRect(field.x+55, field.y+10, barW*(1-elapsed/15), barH);
            ctx.font = "14px Arial";
            ctx.fillStyle = "#423004";
            ctx.fillText(`${15-Math.floor(elapsed)}s`, field.x+barW+62, field.y+19);
        }
    });
    // Buildings
    buildings.forEach(build => {
        let img = new window.Image();
        img.src = build.img;
        ctx.save();
        if (!build.owned) ctx.filter = "grayscale(1) opacity(0.75)";
        ctx.drawImage(img, build.x, build.y, 130, 130);
        ctx.restore();
        // Sayaç
        if (build.type === "waterwell" && build.owned) {
            ctx.fillStyle = "#3ca9de";
            ctx.font = "15px Arial";
            ctx.fillText(`${build.produced}/10`, build.x+52, build.y+19);
        }
    });
}
