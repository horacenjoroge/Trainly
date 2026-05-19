<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Edit Stats</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
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
.top-bar .back{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.top-bar .back:active{transform:translate(1px,1px)}
.top-bar .title{font-size:17px;font-weight:800}
.top-bar .save{padding:6px 16px;border:2px solid var(--border);font-weight:800;font-size:12px;cursor:pointer;background:var(--accent);font-family:var(--font-body)}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-top:4px}
.input-group{display:flex;flex-direction:column;gap:4px}
.input-group .label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--muted)}
.input-group input,.input-group select{font-family:var(--font-body);font-size:15px;padding:12px;border:3px solid var(--border);outline:none;background:var(--surface);color:var(--fg);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s;appearance:none}
.input-group input:focus,.input-group select:focus{border-color:var(--accent)}
.input-group select{cursor:pointer}
.chip-row{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:4px 12px;border:2px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;background:var(--surface);transition:all .08s;font-family:var(--font-body)}
.chip.selected{background:var(--accent)}
.hint{font-size:11px;color:var(--muted);font-weight:500}
.goal-card{border:3px solid var(--border);padding:16px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .08s}
.goal-card:active{background:var(--accent)}
.goal-card .gc-icon{font-size:28px;width:40px;text-align:center}
.goal-card .gc-body{flex:1}
.goal-card .gc-body .gc-title{font-weight:800;font-size:15px}
.goal-card .gc-body .gc-desc{font-size:12px;color:var(--muted)}
.goal-card .gc-check{width:24px;height:24px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:800;font-size:12px}
.goal-card.selected .gc-check{background:var(--accent)}
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
  <a href="settings.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">Edit Stats</div>
  <button class="save" onclick="alert('Stats updated!')">Save</button>
</div>
<div class="scroll">
  <div class="section-label">Body Metrics</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <div class="input-group">
      <span class="label">Height (cm)</span>
      <input type="number" value="178">
    </div>
    <div class="input-group">
      <span class="label">Weight (kg)</span>
      <input type="number" value="72">
    </div>
  </div>
  <div class="input-group">
    <span class="label">Date of Birth</span>
    <input type="date" value="1995-06-15">
  </div>
  <div class="input-group">
    <span class="label">Sex</span>
    <select><option selected>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select>
  </div>
  <div class="section-label">Fitness Goals</div>
  <div class="goal-card selected" onclick="selectGoal(this)">
    <div class="gc-icon">🔥</div>
    <div class="gc-body"><div class="gc-title">Improve Fitness</div><div class="gc-desc">General health & conditioning</div></div>
    <div class="gc-check">✓</div>
  </div>
  <div class="goal-card" onclick="selectGoal(this)">
    <div class="gc-icon">⚖️</div>
    <div class="gc-body"><div class="gc-title">Lose Weight</div><div class="gc-desc">Calorie-focused training</div></div>
    <div class="gc-check"></div>
  </div>
  <div class="goal-card" onclick="selectGoal(this)">
    <div class="gc-icon">💪</div>
    <div class="gc-body"><div class="gc-title">Build Strength</div><div class="gc-desc">Progressive overload</div></div>
    <div class="gc-check"></div>
  </div>
  <div class="goal-card" onclick="selectGoal(this)">
    <div class="gc-icon">🏆</div>
    <div class="gc-body"><div class="gc-title">Race Training</div><div class="gc-desc">Event-specific preparation</div></div>
    <div class="gc-check"></div>
  </div>
  <div class="section-label">Weekly Target</div>
  <div class="input-group">
    <select><option>2-3 workouts</option><option selected>4-5 workouts</option><option>6-7 workouts</option></select>
  </div>
  <div style="height:8px"></div>
</div>
<script>
function selectGoal(el){
  document.querySelectorAll('.goal-card').forEach(g=>g.classList.remove('selected'));
  el.classList.add('selected');
}
</script>
</body>
</html>
