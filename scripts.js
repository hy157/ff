<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mini Tarım Oyunu</title>
  <style>
    html, body {
      margin: 0; padding: 0;
      width: 100vw; height: 100vh;
      font-family: 'Quicksand', Arial, sans-serif;
      overflow: hidden;
      background: #72c8fc;
    }
    .game-bg {
      background: url('assets/images/background.png') center top/cover no-repeat;
      position: absolute; inset: 0;
      width: 100vw; height: 100vh; z-index: 0;
    }
    .game-container {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 1;
    }
    .field-area {
      margin-top: 10vh;
      background: rgba(255,255,255,0.13);
      border-radius: 16px;
      padding: 18px 16px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.08);
      display: flex; flex-direction: column; align-items: center;
      max-width: 340px; width: 90vw;
    }
    .field-img {
      width: 95vw; max-width: 320px; min-width: 150px;
      height: auto; object-fit: contain;
      transition: filter .2s;
      cursor: pointer;
      user-select: none;
      touch-action: manipulation;
    }
    .field-img:active {
      filter: brightness(0.88);
    }
    .info-bar {
      margin: 22px 0 12px 0;
      display: flex; gap: 16px; justify-content: center; align-items: center;
      flex-wrap: wrap;
    }
    .info-item {
      display: flex; align-items: center; gap: 5px;
      font-size: 18px; color: #543909; font-weight: 600;
      background: #f5eab7cc; border-radius: 7px;
      padding: 4px 8px;
    }
    .info-item img {
      width: 26px; height: 26px;
    }
    .btn-reset {
      margin-top: 14px;
      padding: 10px 24px;
      background: #f7c33e;
      color: #53340a;
      font-weight: bold;
      border: none;
      border-radius: 7px;
      box-shadow: 0 2px 8px #0001;
      font-size: 17px;
      cursor: pointer;
      transition: background .2s;
      display: none;
    }
    .btn-reset:active {
      background: #e0b123;
    }
    /* Alt Menü */
    .bottom-menu {
      position: fixed;
      bottom: 0; left: 0; width: 100vw;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #f7c33ed0;
      box-shadow: 0 -2px 16px #0001;
      padding: 6px 0 2px 0;
      z-index: 10;
      height: 56px;
      border-radius: 15px 15px 0 0;
    }
    .menu-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #68431b;
      font-weight: bold;
      background: none;
      border: none;
      outline: none;
      cursor: pointer;
    }
    .menu-btn img {
      width: 34px; height: 34px;
      margin-bottom: 2px;
      pointer-events: none;
    }
    @media (max-width: 600px) {
      .field-img { max-width: 95vw; }
      .field-area { padding: 8vw 3vw; }
      .bottom-menu { height: 48px; }
      .menu-btn img { width: 27px; height: 27px; }
    }
  </style>
</head>
<body>
  <div class="game-bg"></div>
  <div class="game-container">
    <div class="info-bar" id="infoBar">
      <div class="info-item"><img src="assets/images/iconenergy.png" alt="Enerji"> <span id="energyVal">5</span></div>
      <div class="info-item"><img src="assets/images/icongold.png" alt="Altın"> <span id="goldVal">0</span></div>
      <div class="info-item"><img src="assets/images/iconwheat.png" alt="Buğday"> <span id="wheatVal">0</span></div>
      <div class="info-item"><img src="assets/images/icondiamond.png" alt="Elmas"> <span id="diamondVal">0</span></div>
    </div>
    <div class="field-area">
      <img src="assets/images/field.png" id="field" class="field-img" alt="Tarla">
      <div style="margin-top:8px; text-align:center; color:#53340a; font-size:17px;" id="fieldLabel">
        Tarlaya tıkla ve ekim yap!
      </div>
      <button class="btn-reset" id="resetBtn">Tekrar Oyna</button>
    </div>
  </div>
  <!-- Alt Menü -->
  <div class="bottom-menu">
    <button class="menu-btn" id="btnBarn"><img src="assets/images/iconbarn.png" alt="Çiftlik"><span>Çiftlik</span></button>
    <button class="menu-btn" id="btnStore"><img src="assets/images/iconstore.png" alt="Market"><span>Market</span></button>
    <button class="menu-btn" id="btnMap"><img src="assets/images/iconmap.png" alt="Harita"><span>Harita</span></button>
    <button class="menu-btn" id="btnTasks"><img src="assets/images/icontasks.png" alt="Görevler"><span>Görevler</span></button>
    <button class="menu-btn" id="btnSettings"><img src="assets/images/iconsettings.png" alt="Ayarlar"><span>Ayarlar</span></button>
  </div>
  <script src="scripts.js"></script>
</body>
</html>
