<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Snake — édition néon</title>
<script>if(!localStorage.getItem('arcade_token'))location.replace('index.html');</script>
<meta name="description" content="Snake, le jeu rétro en version néon. Mange les pommes, grandis et bats ton record. Jouable au clavier, au doigt ou en glissant sur l'écran.">
<meta name="theme-color" content="#0a0e14">
<meta name="color-scheme" content="dark">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Snake">
<meta property="og:type" content="website">
<meta property="og:title" content="Snake — édition néon">
<meta property="og:description" content="Mange les pommes, grandis et bats ton record. Au clavier ou au doigt.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%230a0e14'/><rect x='5' y='14' width='5' height='5' rx='1.5' fill='%2339ff9e'/><rect x='11' y='14' width='5' height='5' rx='1.5' fill='%2339ff9e'/><rect x='17' y='14' width='5' height='5' rx='1.5' fill='%2339ff9e'/><rect x='20' y='9' width='5' height='5' rx='1.5' fill='%2300e0ff'/><rect x='7' y='21' width='4' height='4' rx='1' fill='%23ff3b6b'/></svg>">
<link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%230a0e14'/><rect x='5' y='14' width='5' height='5' rx='1.5' fill='%2339ff9e'/><rect x='11' y='14' width='5' height='5' rx='1.5' fill='%2339ff9e'/><rect x='17' y='14' width='5' height='5' rx='1.5' fill='%2339ff9e'/><rect x='20' y='9' width='5' height='5' rx='1.5' fill='%2300e0ff'/><rect x='7' y='21' width='4' height='4' rx='1' fill='%23ff3b6b'/></svg>">
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Space+Mono:wght@400;700&display=swap');
:root{
  --bg:#0a0e14; --panel:#0f1622; --line:rgba(255,255,255,.1);
  --neon:#39ff9e; --neon2:#00e0ff; --apple:#ff3b6b; --ink:#e8f5ee; --mute:#74879b;
}
*{box-sizing:border-box;margin:0;padding:0}
body{
  font-family:'Space Grotesk',sans-serif;background:var(--bg);color:var(--ink);
  min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;
  background-image:radial-gradient(circle at 50% -20%, rgba(57,255,158,.08), transparent 60%);
}
.wrap{width:100%;max-width:440px;text-align:center}
.head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:12px}
.title{font-weight:700;font-size:30px;letter-spacing:.04em}
.title .s{color:var(--neon);text-shadow:0 0 16px rgba(57,255,158,.6)}
.scores{display:flex;gap:18px;font-family:'Space Mono',monospace}
.sc{text-align:right}
.sc .lab{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}
.sc .val{font-size:22px;font-weight:700;color:var(--neon2)}
.board-wrap{position:relative;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:var(--panel)}
canvas{display:block;width:100%;height:auto;touch-action:none}
.overlay{
  position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:rgba(10,14,20,.86);backdrop-filter:blur(3px);gap:8px;padding:20px;text-align:center;
}
.overlay.hide{display:none}
.ov-title{font-size:26px;font-weight:700}
.ov-sub{color:var(--mute);font-size:14px;max-width:280px}
.btn{
  cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px;margin-top:8px;
  background:var(--neon);color:#03110a;border:none;border-radius:12px;padding:13px 30px;
  box-shadow:0 0 24px rgba(57,255,158,.4);transition:transform .1s ease,filter .15s ease;
}
.btn:hover{filter:brightness(1.08)} .btn:active{transform:scale(.97)}
.hint{color:var(--mute);font-size:12.5px;margin-top:14px;font-family:'Space Mono',monospace}
.dpad{display:grid;grid-template-columns:repeat(3,58px);grid-template-rows:repeat(2,58px);gap:8px;justify-content:center;margin-top:16px}
.dpad button{
  background:var(--panel);border:1px solid var(--line);border-radius:12px;color:var(--neon);font-size:22px;cursor:pointer;
}
.dpad button:active{background:rgba(57,255,158,.15)}
.d-up{grid-column:2;grid-row:1}.d-left{grid-column:1;grid-row:2}.d-down{grid-column:2;grid-row:2}.d-right{grid-column:3;grid-row:2}
:focus-visible{outline:3px solid var(--neon2);outline-offset:2px}
</style>
</head>
<body>
<a href="index.html" aria-label="Retour au menu" style="position:fixed;top:12px;left:12px;z-index:99;font-family:system-ui,-apple-system,'Space Grotesk',sans-serif;font-size:13px;font-weight:700;text-decoration:none;color:#e8f0ff;background:rgba(20,22,30,.66);border:1px solid rgba(255,255,255,.18);padding:7px 13px;border-radius:10px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:0 4px 16px rgba(0,0,0,.35)">← Menu</a>
<div class="wrap">
  <div class="head">
    <div class="title"><span class="s">SN</span>AKE</div>
    <div class="scores">
      <div class="sc"><div class="lab">Score</div><div class="val" id="score">0</div></div>
      <div class="sc"><div class="lab">Record</div><div class="val" id="best">0</div></div>
    </div>
  </div>
  <div class="board-wrap">
    <canvas id="cv" width="400" height="400"></canvas>
    <div class="overlay" id="ov">
      <div class="ov-title" id="ovTitle">Snake</div>
      <div class="ov-sub" id="ovSub">Mange les pommes, grandis, évite tes propres anneaux et les murs.</div>
      <button class="btn" id="play">Jouer ▶</button>
    </div>
  </div>
  <div class="dpad">
    <button class="d-up" data-d="up">▲</button>
    <button class="d-left" data-d="left">◀</button>
    <button class="d-down" data-d="down">▼</button>
    <button class="d-right" data-d="right">▶</button>
  </div>
  <div class="hint">Flèches du clavier pour bouger · Espace pour pause</div>
</div>
<script src="auth.js"></script>
<script>
const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
const N=20, CELL=cv.width/N;
let snake, dir, nextDir, food, score, best=0, loop=null, speed, running=false, paused=false;
const scoreEl=document.getElementById('score'), bestEl=document.getElementById('best');
const ov=document.getElementById('ov'), ovTitle=document.getElementById('ovTitle'), ovSub=document.getElementById('ovSub');
Arcade.loadBest('snake').then(b=>{ if(b>best){ best=b; bestEl.textContent=b; } });

function reset(){
  snake=[{x:9,y:10},{x:8,y:10},{x:7,y:10}];
  dir={x:1,y:0}; nextDir=dir; score=0; speed=175;
  placeFood(); scoreEl.textContent=0;
}
function placeFood(){
  do{ food={x:Math.random()*N|0,y:Math.random()*N|0}; }
  while(snake.some(s=>s.x===food.x&&s.y===food.y));
}
function startGame(){
  reset(); running=true; paused=false; ov.classList.add('hide');
  clearInterval(loop); loop=setInterval(tick,speed);
}
function tick(){
  if(paused) return;
  dir=nextDir;
  const head={x:snake[0].x+dir.x, y:snake[0].y+dir.y};
  if(head.x<0||head.x>=N||head.y<0||head.y>=N||snake.some(s=>s.x===head.x&&s.y===head.y)){
    return gameOver();
  }
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){
    score++; scoreEl.textContent=score; placeFood();
    if(speed>100&&score%5===0){ speed-=6; clearInterval(loop); loop=setInterval(tick,speed); }
  }else{ snake.pop(); }
  draw();
}
function draw(){
  ctx.fillStyle='#0f1622'; ctx.fillRect(0,0,cv.width,cv.height);
  ctx.strokeStyle='rgba(255,255,255,.04)';
  for(let i=1;i<N;i++){ctx.beginPath();ctx.moveTo(i*CELL,0);ctx.lineTo(i*CELL,cv.height);ctx.moveTo(0,i*CELL);ctx.lineTo(cv.width,i*CELL);ctx.stroke();}
  // pomme
  ctx.fillStyle='#ff3b6b'; ctx.shadowColor='#ff3b6b'; ctx.shadowBlur=16;
  roundRect(food.x*CELL+3,food.y*CELL+3,CELL-6,CELL-6,5); ctx.fill();
  ctx.shadowBlur=0;
  // serpent
  snake.forEach((s,i)=>{
    const t=i/snake.length;
    ctx.fillStyle=i===0?'#39ff9e':`rgba(${Math.round(57+t*0)},${Math.round(255-t*120)},${Math.round(158+t*80)},1)`;
    ctx.shadowColor='#39ff9e'; ctx.shadowBlur=i===0?14:6;
    roundRect(s.x*CELL+2,s.y*CELL+2,CELL-4,CELL-4,6); ctx.fill();
  });
  ctx.shadowBlur=0;
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function gameOver(){
  clearInterval(loop); running=false;
  if(score>best){best=score;bestEl.textContent=best; Arcade.saveBest('snake',best);}
  ovTitle.textContent='Perdu !';
  ovSub.innerHTML='Score : <b style="color:var(--neon)">'+score+'</b>'+(score===best&&score>0?' — nouveau record ! 🏆':'');
  document.getElementById('play').textContent='Rejouer ▶';
  ov.classList.remove('hide');
}
function turn(d){
  const m={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[d];
  if(!m) return;
  if(m.x===-dir.x&&m.y===-dir.y) return; // pas de demi-tour
  nextDir=m;
}
document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  const map={arrowup:'up',arrowdown:'down',arrowleft:'left',arrowright:'right'};
  if(map[k]){e.preventDefault();turn(map[k]);}
  if(k===' '&&running){e.preventDefault();paused=!paused;}
});
document.querySelectorAll('.dpad button').forEach(b=>b.onclick=()=>turn(b.dataset.d));
// swipe
let sx,sy;
cv.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;},{passive:true});
cv.addEventListener('touchend',e=>{
  const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
  if(Math.abs(dx)>Math.abs(dy)) turn(dx>0?'right':'left'); else turn(dy>0?'down':'up');
});
document.getElementById('play').onclick=startGame;
reset(); draw();
</script>
</body>
</html>
