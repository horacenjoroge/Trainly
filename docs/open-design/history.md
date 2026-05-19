<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Workout History</title>
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
.top-bar{display:flex;align-items:center;padding:12px 16px;border-bottom:3px solid var(--border);gap:12px}
.top-bar .back{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.top-bar .back:active{transform:translate(1px,1px)}
.top-bar .title{font-size:17px;font-weight:800}
.filter-row{display:flex;gap:8px;padding:12px 16px;border-bottom:2px solid var(--border);overflow-x:auto}
.filter-chip{padding:6px 16px;border:2px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;background:var(--surface);white-space:nowrap;transition:all .08s;font-family:var(--font-body)}
.filter-chip.active{background:var(--accent)}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.hist-card{border:3px solid var(--border);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);cursor:pointer;transition:all .08s;text-decoration:none;color:var(--fg);display:block}
.hist-card:active{transform:translate(0,0);box-shadow:none}
.hist-card .hc-head{display:flex;align-items:center;gap:12px;padding:12px;border-bottom:2px solid var(--border)}
.hist-card .hc-head .hc-icon{width:40px;height:40px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.hist-card .hc-head .hc-info{flex:1}
.hist-card .hc-head .hc-info .hc-type{font-weight:800;font-size:15px}
.hist-card .hc-head .hc-info .hc-date{font-size:12px;color:var(--muted)}
.hist-card .hc-head .hc-arrow{font-size:16px;color:var(--muted)}
.hc-stats{display:flex;gap:0}
.hc-stat{flex:1;padding:8px;text-align:center;border-right:2px solid var(--border);font-size:12px}
.hc-stat:last-child{border-right:none}
.hc-stat .hc-val{font-weight:900;font-size:15px}
.hc-stat .hc-lbl{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
.summary-row{display:flex;gap:12px;margin-bottom:4px}
.summary-card{flex:1;border:3px solid var(--border);padding:12px;text-align:center;background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.summary-card .sc-val{font-size:24px;font-weight:900;letter-spacing:-0.02em}
.summary-card .sc-val .accent{color:var(--accent)}
.summary-card .sc-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-top:2px}
.empty-state{padding:48px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.empty-state .es-icon{font-size:48px}
.empty-state .es-title{font-weight:800;font-size:17px}
.empty-state .es-desc{font-size:13px;color:var(--muted)}
.pf-nav{display:flex;border-top:4px solid var(--border);background:var(--surface);margin-top:auto}
.nav-item{flex:1;padding:8px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-right:3px solid var(--border);cursor:pointer;color:var(--muted);text-decoration:none;transition:all .08s}
.nav-item:last-child{border-right:none}
.nav-item.active{background:var(--accent);color:var(--fg)}
.nav-item .nav-svg{display:block;width:20px;height:20px;margin:0 auto 4px}
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
  <a href="home.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">Workout History</div>
</div>
<div class="summary-row" style="margin:12px 16px 0">
  <div class="summary-card"><div class="sc-val"><span class="accent">12</span></div><div class="sc-lbl">Total</div></div>
  <div class="summary-card"><div class="sc-val">9<span style="font-size:13px;font-weight:500;color:var(--muted)">h</span></div><div class="sc-lbl">Duration</div></div>
  <div class="summary-card"><div class="sc-val">4.2<span style="font-size:13px;font-weight:500;color:var(--muted)">k</span></div><div class="sc-lbl">Calories</div></div>
</div>
<div class="filter-row">
  <span class="filter-chip active">All</span>
  <span class="filter-chip">🏃 Running</span>
  <span class="filter-chip">🚴 Cycling</span>
  <span class="filter-chip">🏊 Swimming</span>
  <span class="filter-chip">🏋️ Gym</span>
</div>
<div class="scroll">
  <a href="detail.html?w=1" class="hist-card">
    <div class="hc-head">
      <div class="hc-icon">🏃</div>
      <div class="hc-info">
        <div class="hc-type">Morning Run</div>
        <div class="hc-date">Today · 06:32</div>
      </div>
      <div class="hc-arrow">→</div>
    </div>
    <div class="hc-stats">
      <div class="hc-stat"><div class="hc-val">5.2</div><div class="hc-lbl">km</div></div>
      <div class="hc-stat"><div class="hc-val">28:14</div><div class="hc-lbl">min</div></div>
      <div class="hc-stat"><div class="hc-val">5:12</div><div class="hc-lbl">/km</div></div>
      <div class="hc-stat" style="border-right:none"><div class="hc-val">380</div><div class="hc-lbl">kcal</div></div>
    </div>
  </a>
  <a href="detail.html?w=2" class="hist-card">
    <div class="hc-head">
      <div class="hc-icon" style="background:#432DD7;color:#fff">🚴</div>
      <div class="hc-info">
        <div class="hc-type">Evening Ride</div>
        <div class="hc-date">Yesterday · 17:45</div>
      </div>
      <div class="hc-arrow">→</div>
    </div>
    <div class="hc-stats">
      <div class="hc-stat"><div class="hc-val">32.0</div><div class="hc-lbl">km</div></div>
      <div class="hc-stat"><div class="hc-val">1:12:00</div><div class="hc-lbl">min</div></div>
      <div class="hc-stat"><div class="hc-val">26.7</div><div class="hc-lbl">km/h</div></div>
      <div class="hc-stat" style="border-right:none"><div class="hc-val">890</div><div class="hc-lbl">kcal</div></div>
    </div>
  </a>
  <a href="detail.html?w=3" class="hist-card">
    <div class="hc-head">
      <div class="hc-icon" style="background:#16A34A;color:#fff">🏋️</div>
      <div class="hc-info">
        <div class="hc-type">Push Day</div>
        <div class="hc-date">2 days ago · 09:15</div>
      </div>
      <div class="hc-arrow">→</div>
    </div>
    <div class="hc-stats">
      <div class="hc-stat"><div class="hc-val">8</div><div class="hc-lbl">exercises</div></div>
      <div class="hc-stat"><div class="hc-val">12</div><div class="hc-lbl">sets</div></div>
      <div class="hc-stat"><div class="hc-val">45</div><div class="hc-lbl">min</div></div>
      <div class="hc-stat" style="border-right:none"><div class="hc-val">320</div><div class="hc-lbl">kcal</div></div>
    </div>
  </a>
  <a href="detail.html?w=4" class="hist-card">
    <div class="hc-head">
      <div class="hc-icon">🏊</div>
      <div class="hc-info">
        <div class="hc-type">Pool Session</div>
        <div class="hc-date">3 days ago · 07:00</div>
      </div>
      <div class="hc-arrow">→</div>
    </div>
    <div class="hc-stats">
      <div class="hc-stat"><div class="hc-val">40</div><div class="hc-lbl">laps</div></div>
      <div class="hc-stat"><div class="hc-val">1:00:00</div><div class="hc-lbl">min</div></div>
      <div class="hc-stat"><div class="hc-val">1,000</div><div class="hc-lbl">m</div></div>
      <div class="hc-stat" style="border-right:none"><div class="hc-val">420</div><div class="hc-lbl">kcal</div></div>
    </div>
  </a>
  <a href="detail.html?w=5" class="hist-card">
    <div class="hc-head">
      <div class="hc-icon">🏃</div>
      <div class="hc-info">
        <div class="hc-type">Long Run</div>
        <div class="hc-date">5 days ago · 06:00</div>
      </div>
      <div class="hc-arrow">→</div>
    </div>
    <div class="hc-stats">
      <div class="hc-stat"><div class="hc-val">18.0</div><div class="hc-lbl">km</div></div>
      <div class="hc-stat"><div class="hc-val">1:35:00</div><div class="hc-lbl">min</div></div>
      <div class="hc-stat"><div class="hc-val">5:17</div><div class="hc-lbl">/km</div></div>
      <div class="hc-stat" style="border-right:none"><div class="hc-val">1,240</div><div class="hc-lbl">kcal</div></div>
    </div>
  </a>
  <div style="height:8px"></div>
</div>
<div class="pf-nav">
  <a href="home.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 10l9-7 9 7"/><path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"/></svg>Home</a>
  <a href="stats.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>Stats</a>
  <a href="community.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>Feed</a>
  <a href="profile.html" class="nav-item active" style="border-right:none">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>Profile</a>
</div>
</body>
</html>
