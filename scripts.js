// ----- BASİT GAME STATE -----
let coins = 500, energy = 25, maxEnergy = 25, diamonds = 10;
const coinCountSpan = document.getElementById('coinCount');
const energyCountSpan = document.getElementById('energyCount');
const diamondCountSpan = document.getElementById('diamondCount');
function updateCoins(v) { coins = v; coinCountSpan.textContent = coins; }
function updateEnergy(v) { energy = Math.max(0, Math.min(maxEnergy, v)); energyCountSpan.textContent = energy + "/" + maxEnergy; }
function updateDiamonds(v) { diamonds = v; diamondCountSpan.textContent = diamonds; }
updateCoins(coins); updateEnergy(energy); updateDiamonds(diamonds);

// ----- MODAL MANAGEMENT -----
function openModal(type) {
  closeModal();
  let overlay = document.createElement('div');
  overlay.className = 'modal-overlay'; overlay.id = 'modalOverlay';
  overlay.onclick = (e)=>{if(e.target===overlay)closeModal();};
  let modal = document.createElement('div');
  modal.className = 'modal-content';

  // BARN MODAL
  if(type==='barn'){
    modal.classList.add('modal-orange');
    modal.innerHTML = `<button class="modal-close" onclick="closeModal()">✖️</button>
      <h2 style="margin-top:0;">Barn</h2>
      <div>Products and storage will be shown here.</div>`;
  }
  // TASKS MODAL
  else if(type==='tasks'){
    modal.classList.add('modal-red');
    modal.innerHTML = `<button class="modal-close" onclick="closeModal()">✖️</button>
      <h2 style="margin-top:0;">Tasks</h2>
      <div>Simple tasks/quests will be shown here.</div>`;
  }
  // MAP MODAL
  else if(type==='map'){
    modal.classList.add('modal-yellow');
    modal.innerHTML = `<button class="modal-close" onclick="closeModal()">✖️</button>
      <h2 style="margin-top:0;">Map</h2>
      <div>Map feature coming soon!</div>`;
  }
  // STORE MODAL (EN ÇALIŞIR ŞEKİLDE)
  else if(type==='store'){
    modal.classList.add('modal-yellow');
    // Bina ve tarla durumu güncel!
    modal.innerHTML = `
      <button class="modal-close" onclick="closeModal()">✖️</button>
      <h2 style="margin-top:0;">Store</h2>
      <div style="display:flex;flex-direction:column;gap:14px;align-items:center;margin:8px 0 18px 0;">
        <div>
          <img src="assets/images/field.png" style="width:48px;vertical-align:middle">
          <button id="buyFieldBtn" style="margin-left:8px;">Buy Field (50 <img src='assets/images/icongold.png' style='width:18px;vertical-align:middle'>)</button>
        </div>
        <div>
          <img src="assets/images/oven.png" style="width:48px;vertical-align:middle;filter:${buildings[0].owned?'grayscale(1) opacity(.5)':''}">
          <button id="buyOvenBtn" style="margin-left:8px;" ${buildings[0].owned?'disabled':''}>${buildings[0].owned?'Owned':'Buy Oven (200 <img src=\'assets/images/icongold.png\' style=\'width:18px;vertical-align:middle\'>)'}</button>
        </div>
        <div>
          <img src="assets/images/waterwell.png" style="width:48px;vertical-align:middle;filter:${buildings[1].owned?'grayscale(1) opacity(.5)':''}">
          <button id="buyWellBtn" style="margin-left:8px;" ${buildings[1].owned?'disabled':''}>${buildings[1].owned?'Owned':'Buy Well (100 <img src=\'assets/images/icongold.png\' style=\'width:18px;vertical-align:middle\'>)'}</button>
        </div>
        <div>
          <img src="assets/images/windmill.png" style="width:48px;vertical-align:middle;filter:${buildings[2].owned?'grayscale(1) opacity(.5)':''}">
          <button id="buyWindmillBtn" style="margin-left:8px;" ${buildings[2].owned?'disabled':''}>${buildings[2].owned?'Owned':'Buy Windmill (150 <img src=\'assets/images/icongold.png\' style=\'width:18px;vertical-align:middle\'>)'}</button>
        </div>
      </div>
    `;
    setTimeout(()=>{
      document.getElementById('buyFieldBtn').onclick = ()=>{
        if(coins>=50){
          updateCoins(coins-50);
          fields.push({
            x: (window.innerWidth/2)-80,
            y: (window.innerHeight/2)-55,
            state: 0, timer: 0, progress: 0, dragging: false
          });
          closeModal();
        }
      };
      document.getElementById('buyOvenBtn').onclick = ()=>{
        if(coins>=200&&!buildings[0].owned){
          updateCoins(coins-200); buildings[0].owned=true; closeModal();
        }
      };
      document.getElementById('buyWellBtn').onclick = ()=>{
        if(coins>=100&&!buildings[1].owned){
          updateCoins(coins-100); buildings[1].owned=true; closeModal();
        }
      };
      document.getElementById('buyWindmillBtn').onclick = ()=>{
        if(coins>=150&&!buildings[2].owned){
          updateCoins(coins-150); buildings[2].owned=true; closeModal();
        }
      };
    },60);
  }
  // SETTINGS MODAL
  else if(type==='settings'){
    modal.classList.add('modal-orange');
    modal.innerHTML = `<button class="modal-close" onclick="closeModal()">✖️</button>
      <h2 style="margin-top:0;">Settings</h2>
      <div>Coming soon: Music & Sound options!</div>`;
  }
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
function closeModal(){ let o=document.getElementById('modalOverlay'); if(o)o.remove(); }
window.closeModal = closeModal;

// ----- ALT BUTONLAR -----
document.getElementById('btnBarn').onclick = ()=>openModal('barn');
document.getElementById('btnTasks').onclick = ()=>openModal('tasks');
document.getElementById('btnMap').onclick = ()=>openModal('map');
document.getElementById('btnStore').onclick = ()=>openModal('store');
document.getElementById('btnSettings').onclick = ()=>openModal('settings');
