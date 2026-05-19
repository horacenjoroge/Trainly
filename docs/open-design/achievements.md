<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Achievements</title>
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
.top-bar{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:3px solid var(--border)}
.top-bar .back{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.top-bar .back:active{transform:translate(1px,1px)}
.top-bar .title{font-size:17px;font-weight:800}
.tab-bar{display:flex;border-bottom:3px solid var(--border)}
.tab-item{flex:1;padding:12px;text-align:center;font-weight:700;font-size:13px;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-3px;transition:all .08s}
.tab-item.active{border-bottom-color:var(--accent);background:var(--accent)}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.stats-row{display:flex;gap:8px}
.stat-block{flex:1;border:3px solid var(--border);padding:12px;text-align:center;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.stat-block .sb-val{font-size:24px;font-weight:900;letter-spacing:-0.02em}
.stat-block .sb-val .accent{color:var(--accent)}
.stat-block .sb-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-top:2px}
.achiev-card{display:flex;align-items:center;gap:12px;padding:12px;border:3px solid var(--border);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s;opacity:1}
.achiev-card.locked{opacity:.45}
.achiev-card .ac-icon{width:48px;height:48px;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;background:var(--accent)}
.achiev-card.locked .ac-icon{background:var(--muted)}
.achiev-card .ac-body{flex:1}
.achiev-card .ac-body .ac-title{font-weight:800;font-size:15px}
.achiev-card .ac-body .ac-desc{font-size:12px;color:var(--muted);line-height:1.4}
.achiev-card .ac-body .ac-progress{display:flex;align-items:center;gap:8px;margin-top:6px}
.achiev-card .ac-body .ac-progress .pr-bar{flex:1;height:6px;background:var(--border);border:1px solid var(--border)}
.achiev-card .ac-body .ac-progress .pr-bar .pr-fill{height:100%;background:var(--accent);width:0%}
.achiev-card .ac-body .ac-progress .pr-label{font-size:10px;font-weight:700;font-family:var(--font-mono);color:var(--muted)}
.achiev-card .ac-badge{width:28px;height:28px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;background:var(--success);color:#fff}
.achiev-card.locked .ac-badge{background:var(--muted);color:var(--bg)}
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
  <a href="profile.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">🏆 Achievements</div>
</div>
<div class="tab-bar">
  <span class="tab-item active" onclick="switchTab('earned',this)">Earned</span>
  <span class="tab-item" onclick="switchTab('locked',this)">Locked</span>
</div>
<div class="scroll" id="earnedList">
  <div class="stats-row">
    <div class="stat-block"><div class="sb-val"><span class="accent">6</span></div><div class="sb-lbl">Earned</div></div>
    <div class="stat-block"><div class="sb-val">750</div><div class="sb-lbl">Points</div></div>
    <div class="stat-block"><div class="sb-val">Level</div><div class="sb-lbl">3</div></div>
  </div>
  <div class="achiev-card">
    <div class="ac-icon">🏃</div>
    <div class="ac-body">
      <div class="ac-title">First Run</div>
      <div class="ac-desc">Complete your first run</div>
    </div>
    <div class="ac-badge">✓</div>
  </div>
  <div class="achiev-card">
    <div class="ac-icon">🔥</div>
    <div class="ac-body">
      <div class="ac-title">Week Warrior</div>
      <div class="ac-desc">Work out 5 days in a week</div>
    </div>
    <div class="ac-badge">✓</div>
  </div>
  <div class="achiev-card">
    <div class="ac-icon">📍</div>
    <div class="ac-body">
      <div class="ac-title">Trail Blazer</div>
      <div class="ac-desc">Complete a workout using GPS</div>
    </div>
    <div class="ac-badge">✓</div>
  </div>
  <div class="achiev-card">
    <div class="ac-icon">💪</div>
    <div class="ac-body">
      <div class="ac-title">Century Club</div>
      <div class="ac-desc">Record 100 total workouts</div>
    </div>
    <div class="ac-badge">✓</div>
  </div>
  <div class="achiev-card">
    <div class="ac-icon">🚴</div>
    <div class="ac-body">
      <div class="ac-title">Century Ride</div>
      <div class="ac-desc">Cycle 100 km in a single ride</div>
    </div>
    <div class="ac-badge">✓</div>
  </div>
  <div class="achiev-card">
    <div class="ac-icon">🤝</div>
    <div class="ac-body">
      <div class="ac-title">Social Butterfly</div>
      <div class="ac-desc">Connect with 10 athletes</div>
    </div>
    <div class="ac-badge">✓</div>
  </div>
  <div style="height:8px"></div>
</div>
<div class="scroll list-hidden" id="lockedList">
  <div class="achiev-card locked">
    <div class="ac-icon">🏊</div>
    <div class="ac-body">
      <div class="ac-title">Aquaman</div>
      <div class="ac-desc">Swim 50 km total</div>
      <div class="ac-progress"><div class="pr-bar"><div class="pr-fill" style="width:32%"></div></div><span class="pr-label">32%</span></div>
    </div>
    <div class="ac-badge">🔒</div>
  </div>
  <div class="achiev-card locked">
    <div class="ac-icon">⏱</div>
    <div class="ac-body">
      <div class="ac-title">Marathon Finisher</div>
      <div class="ac-desc">Complete a full 42.2 km run</div>
      <div class="ac-progress"><div class="pr-bar"><div class="pr-fill" style="width:0%"></div></div><span class="pr-label">0%</span></div>
    </div>
    <div class="ac-badge">🔒</div>
  </div>
  <div class="achiev-card locked">
    <div class="ac-icon">🌅</div>
    <div class="ac-body">
      <div class="ac-title">Early Bird</div>
      <div class="ac-desc">Work out before 6 AM, 10 times</div>
      <div class="ac-progress"><div class="pr-bar"><div class="pr-fill" style="width:60%"></div></div><span class="pr-label">60%</span></div>
    </div>
    <div class="ac-badge">🔒</div>
  </div>
  <div class="achiev-card locked">
    <div class="ac-icon">🔥</div>
    <div class="ac-body">
      <div class="ac-title">On Fire</div>
      <div class="ac-desc">7-day workout streak</div>
      <div class="ac-progress"><div class="pr-bar"><div class="pr-fill" style="width:71%"></div></div><span class="pr-label">5/7</span></div>
    </div>
    <div class="ac-badge">🔒</div>
  </div>
  <div class="achiev-card locked">
    <div class="ac-icon">🏔️</div>
    <div class="ac-body">
      <div class="ac-title">Peak Performance</div>
      <div class="ac-desc">Climb 10,000 m elevation</div>
      <div class="ac-progress"><div class="pr-bar"><div class="pr-fill" style="width:8%"></div></div><span class="pr-label">8%</span></div>
    </div>
    <div class="ac-badge">🔒</div>
  </div>
  <div style="height:8px"></div>
</div>
<script>
function switchTab(tab,el){
  document.querySelectorAll('.tab-item').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('earnedList').style.display=tab==='earned'?'':'none';
  document.getElementById('lockedList').style.display=tab==='locked'?'':'none';
}
</script>
</body>
</html>
