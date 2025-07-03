// Oyun durumu
let fieldStage = 0; // 0: boş, 1: tohum, 2: fide, 3: olgun, 4: hasat edildi
let energy = 5, gold = 0, wheat = 0, diamond = 0, bread = 0, cookie = 0, flour = 0, water = 0, pretzel = 0;

const fieldImgs = [
  "assets/images/field.png",
  "assets/images/fieldfide.png",
  "assets/images/fieldgreenwheat.png",
  "assets/images/fieldwheatrh.png"
];
const fieldLabels = [
  "Tarlaya tıkla ve ekim yap!",
  "Tohum ektin! Bekle...",
  "Fideler büyüyor!",
  "Buğday olgunlaştı! Hasat için tıkla."
];

// Hasatta rastgele ürün ver
const rewardTypes = [
  { key: "energy", amount: 1, icon: "assets/images/iconenergy.png", text: "+1 Enerji" },
  { key: "gold", amount: 3, icon: "assets/images/icongold.png", text: "+3 Altın" },
  { key: "wheat", amount: 2, icon: "assets/images/iconwheat.png", text: "+2 Buğday" },
  { key: "diamond", amount: 1, icon: "assets/images/icondiamond.png", text: "+1 Elmas" },
  { key: "bread", amount: 1, icon: "assets/images/iconbread.png", text: "+1 Ekmek" },
  { key: "cookie", amount: 1, icon: "assets/images/iconcookie.png", text: "+1 Kurabiye" },
  { key: "flour", amount: 2, icon: "assets/images/iconflour.png", text: "+2 Un" },
  { key: "water", amount: 2, icon: "assets/images/iconwater.png", text: "+2 Su" },
  { key: "pretzel", amount: 1, icon: "assets/images/iconeurokuro.png", text: "+1 Simit" }
];

const field = document.getElementById("field");
const fieldLabel = document.getElementById("fieldLabel");
const resetBtn = document.getElementById("resetBtn");

// Info bar güncelle
function updateInfo() {
  document.getElementById("energyVal").textContent = energy;
  document.getElementById("goldVal").textContent = gold;
  document.getElementById("wheatVal").textContent = wheat;
  document.getElementById("diamondVal").textContent = diamond;
  document.getElementById("breadVal").textContent = bread;
  document.getElementById("cookieVal").textContent = cookie;
  document.getElementById("flourVal").textContent = flour;
  document.getElementById("waterVal").textContent = water;
}

// Tarla tıklama akışı
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
    // Hasat zamanı, rastgele 3 ödül ver
    let chosen = [];
    while(chosen.length < 3) {
      let r = rewardTypes[Math.floor(Math.random()*rewardTypes.length)];
      if (!chosen.some(c => c.key === r.key)) chosen.push(r);
    }
    chosen.forEach(r => {
      if(r.key === "energy") energy += r.amount;
      if(r.key === "gold") gold += r.amount;
      if(r.key === "wheat") wheat += r.amount;
      if(r.key === "diamond") diamond += r.amount;
      if(r.key === "bread") bread += r.amount;
      if(r.key === "cookie") cookie += r.amount;
      if(r.key === "flour") flour += r.amount;
      if(r.key === "water") water += r.amount;
      if(r.key === "pretzel") pretzel += r.amount;
    });
    updateInfo();
    showRewardAnimation(chosen);
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

// Hasat ödülleri göster
function showRewardAnimation(rewards) {
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
  setTimeout(() => rewardRow.remove(), 1700);
}

// Oyun başlat/yenile
function resetGame() {
  fieldStage = 0;
  resetBtn.style.display = "none";
  field.src = fieldImgs[0];
  fieldLabel.textContent = fieldLabels[0];
}

// Menü butonlarına örnek tıklama olayları
document.getElementById("btnOven").onclick = function() {
  alert("Fırında ekmek/kurabiye üret! (Demo)");
}
document.getElementById("btnWell").onclick = function() {
  alert("Kuyudan su çek! (Demo)");
}
document.getElementById("btnWindmill").onclick = function() {
  alert("Değirmende un üret! (Demo)");
}
document.getElementById("btnPretzel").onclick = function() {
  alert("Simit/cookie ödülü kazanmak için özel görevleri tamamla! (Demo)");
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
