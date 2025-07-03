// Oyun durumu
let fieldStage = 0; // 0: boş, 1: tohum, 2: fide, 3: olgun, 4: hasat edildi
let energy = 5, gold = 0, wheat = 0;

const fieldImgs = [
  "field.png",
  "fieldfide.png",
  "fieldgreenwheat.png",
  "fieldwheatrh.png"
];
const fieldLabels = [
  "Tarlaya tıkla ve ekim yap!",
  "Tohum ektin! Bekle...",
  "Fideler büyüyor!",
  "Buğday olgunlaştı! Hasat için tıkla."
];

const rewards = [
  { type: "energy", amount: 1, icon: "iconenergy.png", text: "+1 Enerji" },
  { type: "gold", amount: 5, icon: "icongold.png", text: "+5 Altın" },
  { type: "wheat", amount: 3, icon: "iconwheat.png", text: "+3 Buğday" }
];

const field = document.getElementById("field");
const fieldLabel = document.getElementById("fieldLabel");
const resetBtn = document.getElementById("resetBtn");

// Info bar güncelle
function updateInfo() {
  document.getElementById("energyVal").textContent = energy;
  document.getElementById("goldVal").textContent = gold;
  document.getElementById("wheatVal").textContent = wheat;
}

// Tarlaya tıklandığında aşamaları geç
function nextStage() {
  if(fieldStage === 0) {
    if(energy <= 0) {
      fieldLabel.textContent = "Yeterli enerjin yok!";
      return;
    }
    energy--;
    fieldStage = 1;
    updateInfo();
    updateField();
    setTimeout(() => {
      fieldStage = 2;
      updateField();
      setTimeout(() => {
        fieldStage = 3;
        updateField();
      }, 1600);
    }, 1300);
  }
  else if(fieldStage === 3) {
    // Hasat et
    rewards.forEach(r => {
      if(r.type === "energy") energy += r.amount;
      if(r.type === "gold") gold += r.amount;
      if(r.type === "wheat") wheat += r.amount;
    });
    updateInfo();
    showRewardAnimation();
    fieldStage = 4;
    field.src = fieldImgs[0];
    fieldLabel.textContent = "Hasat tamam! Tekrar ekmek için sıfırla.";
    resetBtn.style.display = "block";
  }
}

function updateField() {
  if(fieldStage < 4) {
    field.src = fieldImgs[fieldStage];
    fieldLabel.textContent = fieldLabels[fieldStage];
    resetBtn.style.display = "none";
  }
}

// Hasat ödülleri görsel olarak gösterilsin
function showRewardAnimation() {
  const area = document.querySelector('.field-area');
  const rewardRow = document.createElement("div");
  rewardRow.style.display = "flex";
  rewardRow.style.gap = "22px";
  rewardRow.style.justifyContent = "center";
  rewardRow.style.margin = "16px 0 0 0";
  rewardRow.style.animation = "fadein .6s";
  rewards.forEach(r => {
    const rew = document.createElement("div");
    rew.style.display = "flex";
    rew.style.flexDirection = "column";
    rew.style.alignItems = "center";
    const img = document.createElement("img");
    img.src = r.icon;
    img.style.width = "38px";
    img.style.marginBottom = "2px";
    rew.appendChild(img);
    const txt = document.createElement("div");
    txt.textContent = r.text;
    txt.style.color = "#6b4407";
    txt.style.fontWeight = "bold";
    txt.style.fontSize = "15px";
    rew.appendChild(txt);
    rewardRow.appendChild(rew);
  });
  area.appendChild(rewardRow);
  setTimeout(() => rewardRow.remove(), 1600);
}

// Oyun başlat/yenile
function resetGame() {
  fieldStage = 0;
  resetBtn.style.display = "none";
  field.src = fieldImgs[0];
  fieldLabel.textContent = fieldLabels[0];
}

field.addEventListener("click", function() {
  if(fieldStage === 4) return; // Oyun bitti
  nextStage();
});
resetBtn.addEventListener("click", resetGame);

// Mobil scrollu engelle, sadece oyun oynansın
window.addEventListener('touchmove', function(e){ e.preventDefault(); }, { passive:false });

updateInfo();
updateField();
