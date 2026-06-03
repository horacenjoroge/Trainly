<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Running Tracker</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
  --success:#16A34A;--danger:#DC2626;--warning:#D97706;
  --font-display:'Inter',system-ui,sans-serif;
  --font-body:'Inter',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  --space-xs:4px;--space-sm:8px;--space-md:12px;--space-lg:16px;--space-xl:24px;--space-2xl:32px;
  --border-w:3px;
}
html{background:#E5E5E5}
body{font-family:var(--font-body);background:#1C293C;max-width:412px;margin:var(--space-xl) auto;border:4px solid #1C293C;min-height:844px;position:relative;overflow:hidden;display:flex;flex-direction:column;color:#fff}
.pf-status{display:flex;align-items:center;justify-content:space-between;padding:var(--space-sm) var(--space-lg);font-size:11px;font-weight:700;font-family:var(--font-mono);background:#1C293C;border-bottom:2px solid #333;color:#9CA3AF}
.pf-icons{display:flex;gap:4px;align-items:center}
.pf-icons svg{display:block;color:#9CA3AF}

.top-bar{display:flex;align-items:center;justify-content:space-between;padding:var(--space-md) var(--space-lg);border-bottom:3px solid #333}
.top-bar .title{font-size:15px;font-weight:700;color:#9CA3AF;display:flex;align-items:center;gap:var(--space-sm)}
.top-bar .title .sos{background:#DC2626;color:#fff;font-weight:800;padding:1px var(--space-sm);font-size:10px;border:1px solid #DC2626}

.timer-wrap{text-align:center;padding:var(--space-xl) var(--space-lg) var(--space-lg)}
.timer-wrap .timer{font-size:57px;font-weight:900;font-family:var(--font-mono);letter-spacing:-0.03em;line-height:1;font-variant-numeric:tabular-nums}
.timer-wrap .timer-label{font-size:13px;color:#9CA3AF;font-weight:600;margin-top:var(--space-xs)}
.timer-wrap .paused-overlay{font-size:13px;font-weight:800;color:var(--warning);text-transform:uppercase;letter-spacing:.08em;margin-top:var(--space-sm)}

.map-card{margin:0 var(--space-lg) var(--space-lg);border:3px solid #333;background:#2A3A4C;height:160px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.map-card .map-text{font-size:13px;font-weight:600;color:#6B7280;text-align:center}
.map-card .map-text span{display:block;font-size:28px;margin-bottom:var(--space-sm)}
.map-card .map-line{position:absolute;top:20%;left:10%;width:80%;height:60%}
.map-card .map-line::before{content:'';position:absolute;top:30%;left:5%;width:90%;height:3px;background:var(--accent);border-radius:2px;transform:rotate(-10deg)}
.map-card .map-line::after{content:'';position:absolute;top:60%;left:10%;width:75%;height:3px;background:var(--accent);border-radius:2px;transform:rotate(5deg)}
.map-card .map-dot{position:absolute;top:25%;left:15%;width:10px;height:10px;background:var(--accent);border:2px solid #fff;border-radius:50%;animation:pulse 1.5s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

.stats-row{display:flex;gap:var(--space-md);margin:0 var(--space-lg) var(--space-lg)}
.stat-box{flex:1;border:3px solid #333;padding:var(--space-md);text-align:center;background:#1C293C}
.stat-box .sb-val{font-size:21px;font-weight:900;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
.stat-box .sb-val .unit{font-size:12px;font-weight:500;color:#9CA3AF}
.stat-box .sb-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9CA3AF;margin-top:2px}
.stat-box.accent .sb-val{color:var(--accent)}

.controls{display:flex;gap:var(--space-md);margin:0 var(--space-lg);padding-bottom:var(--space-lg);flex-wrap:wrap}
.ctrl-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:var(--space-sm);font-family:var(--font-body);font-weight:800;border:3px solid var(--border);cursor:pointer;padding:var(--space-lg);font-size:15px;min-height:56px;background:var(--surface);color:var(--fg);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s;text-decoration:none}
.ctrl-btn:active{transform:translate(0,0);box-shadow:none}
.ctrl-btn.start-pause{background:var(--accent);flex:2}
.ctrl-btn.start-pause.paused{background:var(--success);color:#fff;border-color:var(--success)}
.ctrl-btn.finish{background:var(--surface)}
.ctrl-btn.finish:disabled{opacity:.4;pointer-events:none}
.ctrl-btn.outline{background:transparent;color:#fff;border-color:#555;box-shadow:4px 4px 0 #333}

.dialog-overlay{display:none;position:absolute;inset:0;background:rgba(0,0,0,.6);z-index:10;align-items:center;justify-content:center;padding:var(--space-xl)}
.dialog-overlay.show{display:flex}
.dialog{border:4px solid var(--border);background:var(--surface);padding:var(--space-xl);max-width:340px;width:100%;color:var(--fg)}
.dialog h3{font-size:21px;font-weight:900;margin-bottom:var(--space-sm)}
.dialog p{font-size:14px;color:var(--muted);margin-bottom:var(--space-lg);line-height:1.5}
.dialog-actions{display:flex;gap:var(--space-md)}
.dialog-actions button{flex:1;padding:var(--space-md);font-weight:800;border:3px solid var(--border);cursor:pointer;font-family:var(--font-body);font-size:14px;transition:all .08s;transform:translate(-2px,-2px);box-shadow:3px 3px 0 var(--border)}
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
    <span style="font-size:20px">🏃</span> Running
    <span class="sos" onclick="window.location='emergency.html'">SOS</span>
  </div>
  <div style="font-size:13px;color:#9CA3AF;font-weight:600">GPS Active</div>
</div>

<div class="timer-wrap">
  <div class="timer" id="timerDisplay">00:00:00</div>
  <div class="timer-label" id="timerLabel">Elapsed Time</div>
  <div class="paused-overlay" id="pausedLabel" style="display:none">⏸ Paused</div>
</div>

<div class="map-card">
  <div class="map-text"><span>📍</span> GPS tracking active</div>
  <div class="map-line"></div>
  <div class="map-dot"></div>
</div>

<div class="stats-row">
  <div class="stat-box">
    <div class="sb-val">0.0 <span class="unit">km</span></div>
    <div class="sb-label">Distance</div>
  </div>
  <div class="stat-box accent">
    <div class="sb-val">--:-- <span class="unit">/km</span></div>
    <div class="sb-label">Pace</div>
  </div>
  <div class="stat-box">
    <div class="sb-val">0 <span class="unit">kcal</span></div>
    <div class="sb-label">Calories</div>
  </div>
</div>

<div class="controls">
  <button class="ctrl-btn start-pause" id="startBtn" onclick="toggleRun()">
    <span id="startBtnText">▶ Start</span>
  </button>
  <button class="ctrl-btn outline" id="splitBtn" onclick="recordSplit()" disabled>Split</button>
  <button class="ctrl-btn finish" id="finishBtn" onclick="showFinishDialog()" disabled>Finish</button>
</div>

<div class="dialog-overlay" id="finishDialog">
  <div class="dialog">
    <h3>Save Workout?</h3>
    <p id="dialogSummary">5.2 km in 28:14 at 5:12/km pace. Save this workout to your history?</p>
    <div class="dialog-actions">
      <button class="outline" onclick="hideFinishDialog()">Discard</button>
      <button class="primary" onclick="saveWorkout()">Save</button>
    </div>
  </div>
</div>

<script>
let seconds = 0;
let running = false;
let interval = null;
let distance = 0;

function pad(n){return String(n).padStart(2,'0')}
function formatTime(s){
  const h=Math.floor(s/3600);
  const m=Math.floor((s%3600)/60);
  const sec=s%60;
  return h>0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

function toggleRun(){
  const btn=document.getElementById('startBtn');
  const text=document.getElementById('startBtnText');
  const pausedLbl=document.getElementById('pausedLabel');
  const splitBtn=document.getElementById('splitBtn');
  const finishBtn=document.getElementById('finishBtn');
  if(!running){
    if(seconds===0){
      interval=setInterval(()=>{
        seconds++;
        document.getElementById('timerDisplay').textContent=formatTime(seconds);
        distance = (seconds/120).toFixed(2);
        document.querySelector('.stat-box .sb-val').innerHTML=distance+' <span class="unit">km</span>';
        const pace = seconds>0 ? formatTime(Math.floor(seconds/parseFloat(distance||1))) : '--:--';
        document.querySelector('.stat-box.accent .sb-val').innerHTML=pace+' <span class="unit">/km</span>';
      },1000);
    }else{
      interval=setInterval(()=>{
        seconds++;
        document.getElementById('timerDisplay').textContent=formatTime(seconds);
      },1000);
    }
    running=true;
    btn.classList.remove('paused');
    text.textContent='⏸ Pause';
    pausedLbl.style.display='none';
    splitBtn.disabled=false;
    finishBtn.disabled=false;
  }else{
    clearInterval(interval);
    running=false;
    btn.classList.add('paused');
    text.textContent='▶ Resume';
    pausedLbl.style.display='block';
  }
}

function recordSplit(){
  const pace = seconds>0 && distance>0 ? formatTime(Math.floor(seconds/distance)) : '--:--';
  alert(`Split at ${distance} km — ${formatTime(seconds)}, pace ${pace}/km`);
}

function showFinishDialog(){
  clearInterval(interval);
  running=false;
  const btn=document.getElementById('startBtn');
  btn.classList.add('paused');
  document.getElementById('startBtnText').textContent='▶ Resume';
  document.getElementById('pausedLabel').style.display='block';
  const pace = seconds>0 && distance>0 ? formatTime(Math.floor(seconds/distance)) : '--:--';
  document.getElementById('dialogSummary').textContent =
    `${distance} km in ${formatTime(seconds)} at ${pace}/km pace. Save this workout to your history?`;
  document.getElementById('finishDialog').classList.add('show');
}

function hideFinishDialog(){
  document.getElementById('finishDialog').classList.remove('show');
}

function saveWorkout(){
  alert('Workout saved! Redirecting to history...');
  window.location='history.html';
}
</script>
</body>
</html>
