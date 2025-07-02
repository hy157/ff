// Görsel yolları
const fieldStates = [
    "assets/images/field.png",
    "assets/images/fieldfide.png",
    "assets/images/fieldgreenwheat.png",
    "assets/images/fieldwheatrh.png"
];
// --- BUILDING SPAWN ORTADA ---
function spawnInitialBuildingsAndField() {
    fields.length = 0;
    fields.push({
        x: (window.innerWidth / 2) - 80,
        y: (window.innerHeight / 2) - 55,
        state: 0, timer: 0, progress: 0, dragging: false
    });
    buildings.length = 0;
    buildings.push(
        { type: "oven", owned: false, img: "assets/images/oven.png", x: (window.innerWidth/2)-160, y: (window.innerHeight/2)-160, price: 200, dragging: false, level: 1, timer: 0 },
        { type: "waterwell", owned: false, img: "assets/images/waterwell.png", x: (window.innerWidth/2)+60, y: (window.innerHeight/2)-160, price: 100, dragging: false, level: 1, produced: 0, timer: 0, lastTick: 0 },
        { type: "windmill", owned: false, img: "assets/images/windmill.png", x: (window.innerWidth/2)-50, y: (window.innerHeight/2)+60, price: 150, dragging: false, level: 1, timer: 0 }
    );
}
window.spawnInitialBuildingsAndField = spawnInitialBuildingsAndField;
window.addEventListener("DOMContentLoaded", () => { spawnInitialBuildingsAndField(); });
window.addEventListener('resize', () => {
    if(fields[0]) {
        fields[0].x = (window.innerWidth/2)-80;
        fields[0].y = (window.innerHeight/2)-55;
    }
    if(buildings[0]) buildings[0].x = (window.innerWidth/2)-160, buildings[0].y = (window.innerHeight/2)-160;
    if(buildings[1]) buildings[1].x = (window.innerWidth/2)+60,  buildings[1].y = (window.innerHeight/2)-160;
    if(buildings[2]) buildings[2].x = (window.innerWidth/2)-50,  buildings[2].y = (window.innerHeight/2)+60;
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
// --- TIKLAMA ---
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
// ... openFieldPopup, openBuildingPopup, flyToObject, buildingsLoop, drawBuildings yukarıda verdiğim gibi ...
// (Kodun tamamı bir önceki uzun buildings.js örneğindekiyle aynıdır.)
