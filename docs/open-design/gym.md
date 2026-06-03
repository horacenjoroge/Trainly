<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Gym Workout</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
  --success:#16A34A;--danger:#DC2626;
  --font-display:'Inter',system-ui,sans-serif;
  --font-body:'Inter',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  --space-xs:4px;--space-sm:8px;--space-md:12px;--space-lg:16px;--space-xl:24px;--space-2xl:32px;
}
html{background:#E5E5E5}
body{font-family:var(--font-body);background:var(--surface);max-width:412px;margin:24px auto;border:4px solid var(--border);min-height:844px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.pf-status{display:flex;align-items:center;justify-content:space-between;padding:4px 16px;font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace;background:var(--surface);border-bottom:2px solid var(--border)}
.pf-icons{display:flex;gap:4px;align-items:center}
.pf-icons svg{display:block}
.top-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:3px solid var(--border)}
.top-bar .title{font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px}
.top-bar .timer-top{font-size:13px;font-weight:700;font-family:var(--font-mono);color:var(--muted);font-variant-numeric:tabular-nums}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.add-exercise{border:3px dashed var(--border);padding:16px;text-align:center;font-weight:700;font-size:15px;color:var(--muted);cursor:pointer;transition:all .08s;display:flex;align-items:center;justify-content:center;gap:8px}
.add-exercise:active{background:var(--accent);color:var(--fg)}
.ex-card{border:3px solid var(--border);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);overflow:hidden}
.ex-card .ex-head{display:flex;align-items:center;justify-content:space-between;padding:12px;border-bottom:2px solid var(--border);font-weight:800;font-size:15px}
.ex-card .ex-head .ex-num{width:28px;height:28px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;background:var(--accent)}
.ex-card .ex-head .ex-edit{font-size:13px;color:var(--muted);cursor:pointer}
.ex-card .ex-sets{padding:8px 12px}
.set-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px}
.set-row:last-child{border-bottom:none}
.set-row .sr-label{font-weight:600;width:36px;color:var(--muted)}
.set-row .sr-weight{flex:1;font-weight:800}
.set-row .sr-reps{flex:1;color:var(--muted)}
.set-row .sr-check{width:28px;height:28px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .08s;flex-shrink:0}
.set-row .sr-check.done{background:var(--accent)}
.ex-foot{display:flex;gap:8px;padding:8px 12px;border-top:2px solid var(--border)}
.ex-foot button{flex:1;padding:8px;border:2px solid var(--border);font-weight:700;font-size:12px;cursor:pointer;font-family:var(--font-body);background:var(--surface);transition:all .08s}
.ex-foot button:active{background:var(--accent)}
.controls{display:flex;gap:12px;padding:16px;border-top:3px solid var(--border)}
.ctrl-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;font-family:var(--font-body);font-weight:800;border:3px solid var(--border);cursor:pointer;padding:16px;font-size:15px;min-height:52px;background:var(--surface);color:var(--fg);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s}
.ctrl-btn:active{transform:translate(0,0);box-shadow:none}
.ctrl-btn.primary{background:var(--accent);flex:2}
.ctrl-btn.danger{background:var(--danger);color:#fff;border-color:var(--danger)}
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
  <div class="title">🏋️ Gym Session</div>
  <div class="timer-top" id="gymTimer">00:00</div>
</div>
<div class="scroll">
  <div class="add-exercise" onclick="addExercise()">
    <span style="font-size:20px;font-weight:300">+</span> Add Exercise
  </div>
  <div class="ex-card">
    <div class="ex-head">
      <div style="display:flex;align-items:center;gap:8px"><span class="ex-num">1</span> Bench Press</div>
      <div class="ex-edit">⋯</div>
    </div>
    <div class="ex-sets">
      <div class="set-row"><span class="sr-label">1</span><span class="sr-weight">60 kg</span><span class="sr-reps">10 reps</span><div class="sr-check done">✓</div></div>
      <div class="set-row"><span class="sr-label">2</span><span class="sr-weight">65 kg</span><span class="sr-reps">8 reps</span><div class="sr-check done">✓</div></div>
      <div class="set-row"><span class="sr-label">3</span><span class="sr-weight">70 kg</span><span class="sr-reps">6 reps</span><div class="sr-check"></div></div>
    </div>
    <div class="ex-foot">
      <button>+ Set</button>
      <button>Complete</button>
    </div>
  </div>
  <div class="ex-card">
    <div class="ex-head">
      <div style="display:flex;align-items:center;gap:8px"><span class="ex-num">2</span> Squat</div>
      <div class="ex-edit">⋯</div>
    </div>
    <div class="ex-sets">
      <div class="set-row"><span class="sr-label">1</span><span class="sr-weight">80 kg</span><span class="sr-reps">10 reps</span><div class="sr-check done">✓</div></div>
      <div class="set-row"><span class="sr-label">2</span><span class="sr-weight">90 kg</span><span class="sr-reps">8 reps</span><div class="sr-check done">✓</div></div>
      <div class="set-row"><span class="sr-label">3</span><span class="sr-weight">100 kg</span><span class="sr-reps">5 reps</span><div class="sr-check"></div></div>
    </div>
    <div class="ex-foot">
      <button>+ Set</button>
      <button>Complete</button>
    </div>
  </div>
  <div class="ex-card">
    <div class="ex-head">
      <div style="display:flex;align-items:center;gap:8px"><span class="ex-num">3</span> Pull Ups</div>
      <div class="ex-edit">⋯</div>
    </div>
    <div class="ex-sets">
      <div class="set-row"><span class="sr-label">1</span><span class="sr-weight">BW</span><span class="sr-reps">8 reps</span><div class="sr-check"></div></div>
      <div class="set-row"><span class="sr-label">2</span><span class="sr-weight">BW</span><span class="sr-reps">6 reps</span><div class="sr-check"></div></div>
    </div>
    <div class="ex-foot">
      <button>+ Set</button>
      <button>Complete</button>
    </div>
  </div>
  <div style="height:8px"></div>
</div>
<div class="controls">
  <button class="ctrl-btn danger" onclick="if(confirm('End workout?'))window.location='history.html'">End</button>
  <button class="ctrl-btn primary" onclick="alert('Workout saved!');window.location='history.html'">Finish Workout</button>
</div>
<script>
let gymSeconds=0;
setInterval(()=>{
  gymSeconds++;const m=Math.floor(gymSeconds/60),s=gymSeconds%60;
  document.getElementById('gymTimer').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
},1000);
function addExercise(){alert('New exercise added (mock)')}
document.querySelectorAll('.sr-check:not(.done)').forEach(el=>{
  el.addEventListener('click',function(){this.classList.toggle('done');this.textContent=this.classList.contains('done')?'✓':''})
});
</script>
</body>
</html>
