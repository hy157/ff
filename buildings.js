// --- FIELDS & BUILDINGS DATA ---
window.fields = window.fields || [];
window.buildings = window.buildings || [];

function spawnInitialBuildingsAndField() {
  // Tarla ve binaları ortada başlat
  fields.length = 0;
  fields.push({x:(window.innerWidth/2)-80,y:(window.innerHeight/2)-55,state:0,timer:0,progress:0,dragging:false});
  buildings.length = 0;
  // OVEN, WELL, WINDMILL
  buildings.push(
    {type:"oven",owned:false,img:"assets/images/oven.png",x:(window.innerWidth/2)-160,y:(window.innerHeight/2)-160,price:200,dragging:false},
    {type:"waterwell",owned:false,img:"assets/images/waterwell.png",x:(window.innerWidth/2)+60,y:(window.innerHeight/2)-160,price:100,dragging:false},
    {type:"windmill",owned:false,img:"assets/images/windmill.png",x:(window.innerWidth/2)-50,y:(window.innerHeight/2)+60,price:150,dragging:false}
  );
}
window.spawnInitialBuildingsAndField = spawnInitialBuildingsAndField;
window.addEventListener("DOMContentLoaded",()=>{spawnInitialBuildingsAndField();});
window.addEventListener('resize',()=>{spawnInitialBuildingsAndField();});

// --- BASİT OYUN DÖNGÜSÜ VE CANVAS ---
const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
resizeCanvas(); window.addEventListener('resize',resizeCanvas);

// FIELD GÖRSELLERİ
const fieldStates=[
  "assets/images/field.png",
  "assets/images/fieldfide.png",
  "assets/images/fieldgreenwheat.png",
  "assets/images/fieldwheatrh.png"
];

// OYUN ÇİZİM DÖNGÜSÜ
function drawGame(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // TARLALAR
  fields.forEach(field=>{
    let img=new window.Image(); img.src=fieldStates[field.state||0];
    ctx.drawImage(img,field.x,field.y,160,110);
  });
  // BİNALAR
  buildings.forEach(build=>{
    let img=new window.Image(); img.src=build.img;
    ctx.save(); if(!build.owned)ctx.filter="grayscale(1) opacity(0.7)";
    ctx.drawImage(img,build.x,build.y,110,110); ctx.restore();
  });
  requestAnimationFrame(drawGame);
}
requestAnimationFrame(drawGame);
