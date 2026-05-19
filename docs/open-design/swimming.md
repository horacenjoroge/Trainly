<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Swimming Tracker</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
  --success:#16A34A;--danger:#DC2626;--warning:#D97706;
  --font-display:'Inter',system-ui,sans-serif;
  --font-body:'Inter',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',monospace;
}
html{background:#E5E5E5}
body{font-family:var(--font-body);background:#1C293C;max-width:412px;margin:24px auto;border:4px solid #1C293C;min-height:844px;position:relative;overflow:hidden;display:flex;flex-direction:column;color:#fff}
.pf-status{display:flex;align-items:center;justify-content:space-between;padding:4px 16px;font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace;background:#1C293C;border-bottom:2px solid #333;color:#9CA3AF}
.pf-icons{display:flex;gap:4px;align-items:center}
.pf-icons svg{display:block;color:#9CA3AF}
.top-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:3px solid #333}
.top-bar .title{font-size:15px;font-weight:700;color:#9CA3AF;display:flex;align-items:center;gap:8px}
.top-bar .title .sos{background:#DC2626;color:#fff;font-weight:800;padding:1px 8px;font-size:10px;border:1px solid #DC2626}
.timer-wrap{text-align:center;padding:24px 16px 16px}
.timer-wrap .timer{font-size:57px;font-weight:900;font-family:'JetBrains Mono',monospace;letter-spacing:-0.03em;line-height:1;font-variant-numeric:tabular-nums}
.timer-wrap .timer-label{font-size:13px;color:#9CA3AF;font-weight:600;margin-top:4px}
.lap-card{margin:0 16px 16px;border:3px solid #333;background:#2A3A4C;padding:24px;text-align:center}
.lap-card .lap-count{font-size:64px;font-weight:900;line-height:1;color:var(--accent);font-variant-numeric:tabular-nums}
.lap-card .lap-label{font-size:13px;color:#9CA3AF;font-weight:600;margin-top:4px}
.lap-card .lap-controls{display:flex;gap:12px;margin-top:16px;justify-content:center}
.lap-card .lap-controls button{width:56px;height:56px;border:3px solid #555;background:transparent;color:#fff;font-size:24px;font-weight:700;cursor:pointer;transition:all .08s;display:flex;align-items:center;justify-content:center}
.lap-card .lap-controls button:active{background:var(--accent);color:var(--fg)}
.lap-card .lap-sub{margin-top:12px;display:flex;justify-content:center;gap:16px;font-size:12px;color:#9CA3AF}
.lap-card .lap-sub select{background:#1C293C;color:#fff;border:2px solid #555;padding:4px 8px;font-family:var(--font-body);font-size:12px;font-weight:600}
.stats-row{display:flex;gap:12px;margin:0 16px 16px}
.stat-box{flex:1;border:3px solid #333;padding:12px;text-align:center;background:#1C293C}
.stat-box .sb-val{font-size:21px;font-weight:900;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
.stat-box .sb-val .unit{font-size:12px;font-weight:500;color:#9CA3AF}
.stat-box .sb-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9CA3AF;margin-top:2px}
.stat-box.accent .sb-val{color:var(--accent)}
.controls{display:flex;gap:12px;margin:0 16px;padding-bottom:16px}
.ctrl-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;font-family:var(--font-body);font-weight:800;border:3px solid var(--border);cursor:pointer;padding:16px;font-size:15px;min-height:56px;background:var(--surface);color:var(--fg);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s}
.ctrl-btn:active{transform:translate(0,0);box-shadow:none}
.ctrl-btn.start-pause{background:var(--accent);flex:2}
.ctrl-btn.start-pause.paused{background:var(--success);color:#fff;border-color:var(--success)}
.ctrl-btn.finish{background:var(--surface)}
.ctrl-btn.finish:disabled{opacity:.4;pointer-events:none}
.dialog-overlay{display:none;position:absolute;inset:0;background:rgba(0,0,0,.6);z-index:10;align-items:center;justify-content:center;padding:24px}
.dialog-overlay.show{display:flex}
.dialog{border:4px solid var(--border);background:var(--surface);padding:24px;max-width:340px;width:100%;color:var(--fg)}
.dialog h3{font-size:21px;font-weight:900;margin-bottom:8px}
.dialog p{font-size:14px;color:var(--muted);margin-bottom:16px;line-height:1.5}
.dialog-actions{display:flex;gap:12px}
.dialog-actions button{flex:1;padding:12px;font-weight:800;border:3px solid var(--border);cursor:pointer;font-family:var(--font-body);font-size:14px;transition:all .08s;transform:translate(-2px,-2px);box-shadow:3px 3px 0 var(--border)}
.dialog-actions button:active{transform:translate(0,0);box-shadow:none}
.dialog-actions .primary{background:var(--accent);color:var(--fg)}
.dialog-actions .outline{background:var(--surface);color:var(--fg)}
</style>
</head>
<body>
<div class="pf-status">
  <span>9:41</span>
  <span class="pf-icons">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 9l4 4-4 4"/><path d="M9 21h14"/><path d="M9 13h14"/><path d="M9 5h14"/></svg>
    <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="3" height="10" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><rect x="14" y="1" width="3" height="22" rx="1"/><rect x="20" y="4" width="3" height="16" rx="1"/></svg>
  </span>
</div>
<div class="top-bar">
  <div class="title">
    <span style="font-size:20px">🏊</span> Swimming
    <span class="sos" onclick="window.location='emergency.html'">SOS</span>
  </div>
  <div style="font-size:13px;color:#9CA3AF;font-weight:600">Pool Mode</div>
</div>
<div class="timer-wrap">
  <div class="timer" id="timerDisplay">00:00:00</div>
  <div class="timer-label">Elapsed Time</div>
</div>
<div class="lap-card">
  <div class="lap-count" id="lapCount">0</div>
  <div class="lap-label">Laps Completed</div>
  <div class="lap-controls">
    <button onclick="lapDown()">−</button>
    <button onclick="lapUp()">+</button>
  </div>
  <div class="lap-sub">
    <span>Pool: <select><option selected>25m</option><option>50m</option></select></span>
    <span id="totalDist">0 m</span>
  </div>
</div>
<div class="stats-row">
  <div class="stat-box accent">
    <div class="sb-val" id="distVal">0 <span class="unit">m</span></div>
    <div class="sb-label">Distance</div>
  </div>
  <div class="stat-box">
    <div class="sb-val">0 <span class="unit">kcal</span></div>
    <div class="sb-label">Calories</div>
  </div>
</div>
<div class="controls">
  <button class="ctrl-btn start-pause" id="startBtn" onclick="toggleRun()"><span id="startBtnText">▶ Start</span></button>
  <button class="ctrl-btn finish" id="finishBtn" onclick="showFinishDialog()" disabled>Finish</button>
</div>
<div class="dialog-overlay" id="finishDialog">
  <div class="dialog">
    <h3>Save Workout?</h3>
    <p id="dialogSummary">0 laps, 0 m in 00:00. Save this swim to your history?</p>
    <div class="dialog-actions">
      <button class="outline" onclick="hideFinishDialog()">Discard</button>
      <button class="primary" onclick="saveWorkout()">Save</button>
    </div>
  </div>
</div>
<script>
let seconds=0,running=false,interval=null,laps=0;
function pad(n){return String(n).padStart(2,'0')}
function formatTime(s){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h>0?`${pad(h)}:${pad(m)}:${pad(sec)}`:`${pad(m)}:${pad(sec)}`}
function toggleRun(){
  const btn=document.getElementById('startBtn'),text=document.getElementById('startBtnText'),finishBtn=document.getElementById('finishBtn');
  if(!running){
    interval=setInterval(()=>{seconds++;document.getElementById('timerDisplay').textContent=formatTime(seconds)},1000);
    running=true;btn.classList.remove('paused');text.textContent='⏸ Pause';finishBtn.disabled=false;
  }else{clearInterval(interval);running=false;btn.classList.add('paused');text.textContent='▶ Resume'}
}
function lapUp(){laps++;updateLaps()}
function lapDown(){if(laps>0){laps--;updateLaps()}}
function updateLaps(){
  document.getElementById('lapCount').textContent=laps;
  const pool=document.querySelector('.lap-card select').value;
  const total=laps*parseInt(pool);
  document.getElementById('totalDist').textContent=total+' m';
  document.getElementById('distVal').innerHTML=total+' <span class="unit">m</span>';
}
document.querySelector('.lap-card select').addEventListener('change',updateLaps);
function showFinishDialog(){
  clearInterval(interval);running=false;
  document.getElementById('startBtn').classList.add('paused');document.getElementById('startBtnText').textContent='▶ Resume';
  const pool=parseInt(document.querySelector('.lap-card select').value);
  document.getElementById('dialogSummary').textContent=`${laps} laps, ${laps*pool} m in ${formatTime(seconds)}. Save this swim to your history?`;
  document.getElementById('finishDialog').classList.add('show');
}
function hideFinishDialog(){document.getElementById('finishDialog').classList.remove('show')}
function saveWorkout(){alert('Swim saved!');window.location='history.html'}
</script>
</body>
</html>
