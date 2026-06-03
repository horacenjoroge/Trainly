<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Analytics</title>
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
.top-bar .title{font-size:17px;font-weight:800}
.top-bar .actions{display:flex;gap:8px}
.top-bar .actions .a{width:28px;height:28px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.filter-row{display:flex;gap:8px}
.filter-chip{padding:6px 16px;border:2px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;background:var(--surface);transition:all .08s;font-family:var(--font-body)}
.filter-chip.active{background:var(--accent)}
.metrics-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.metric-block{border:3px solid var(--border);padding:16px;text-align:center;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);background:var(--surface)}
.metric-block .mb-val{font-size:32px;font-weight:900;letter-spacing:-0.03em;line-height:1}
.metric-block .mb-val .accent{color:var(--accent)}
.metric-block .mb-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-top:4px}
.metric-block.wide{grid-column:1/-1}
.chart-card{border:3px solid var(--border);padding:16px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);background:var(--surface)}
.chart-card .cc-title{font-weight:800;font-size:15px;margin-bottom:12px}
.donut{display:flex;align-items:center;gap:24px;justify-content:center}
.donut-ring{width:100px;height:100px;border-radius:50%;border:8px solid var(--border);position:relative;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;flex-shrink:0;background:conic-gradient(var(--accent) 0deg 162deg, #432DD7 162deg 252deg, #16A34A 252deg 306deg, var(--muted) 306deg 360deg)}
.donut-ring span{background:var(--surface);padding:4px 8px;border:2px solid var(--border)}
.donut-legend{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:600}
.donut-legend .dl-item{display:flex;align-items:center;gap:8px}
.donut-legend .dl-item .dl-dot{width:12px;height:12px;border:2px solid var(--border)}
.bar-chart{display:flex;gap:4px;align-items:flex-end;height:120px;padding-top:8px}
.bar-chart .bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bar-chart .bar-wrap .bar{width:100%;background:var(--accent);border:2px solid var(--border);min-height:4px;transition:height .3s}
.bar-chart .bar-wrap .bar-label{font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase}
.bar-chart .bar-wrap .bar-val{font-size:9px;font-weight:800;font-family:var(--font-mono)}
.summary-footer{border:3px solid var(--border);padding:16px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);display:flex;justify-content:space-between}
.summary-footer .sf-item{text-align:center}
.summary-footer .sf-item .sf-val{font-size:17px;font-weight:900}
.summary-footer .sf-item .sf-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
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
  <div class="title">📊 Workout Stats</div>
</div>
<div class="scroll">
  <div class="filter-row">
    <span class="filter-chip active">7D</span>
    <span class="filter-chip">30D</span>
    <span class="filter-chip">90D</span>
    <span class="filter-chip">1Y</span>
  </div>
  <div class="metrics-row">
    <div class="metric-block"><div class="mb-val"><span class="accent">10</span></div><div class="mb-lbl">Workouts</div></div>
    <div class="metric-block"><div class="mb-val">6.5<span style="font-size:13px;color:var(--muted);font-weight:500">h</span></div><div class="mb-lbl">Total Time</div></div>
    <div class="metric-block"><div class="mb-val">52.4</div><div class="mb-lbl">Distance (km)</div></div>
    <div class="metric-block"><div class="mb-val">3,200</div><div class="mb-lbl">Calories</div></div>
  </div>
  <div class="chart-card">
    <div class="cc-title">Activity Breakdown</div>
    <div class="donut">
      <div class="donut-ring"><span>10</span></div>
      <div class="donut-legend">
        <div class="dl-item"><span class="dl-dot" style="background:var(--accent)"></span> Running 45%</div>
        <div class="dl-item"><span class="dl-dot" style="background:#432DD7"></span> Cycling 25%</div>
        <div class="dl-item"><span class="dl-dot" style="background:#16A34A"></span> Swimming 15%</div>
        <div class="dl-item"><span class="dl-dot" style="background:var(--muted)"></span> Gym 15%</div>
      </div>
    </div>
  </div>
  <div class="chart-card">
    <div class="cc-title">Weekly Trend</div>
    <div class="bar-chart">
      <div class="bar-wrap"><div class="bar" style="height:24px"></div><span class="bar-val">1</span><span class="bar-label">Mon</span></div>
      <div class="bar-wrap"><div class="bar" style="height:40px"></div><span class="bar-val">2</span><span class="bar-label">Tue</span></div>
      <div class="bar-wrap"><div class="bar" style="height:4px"></div><span class="bar-val">0</span><span class="bar-label">Wed</span></div>
      <div class="bar-wrap"><div class="bar" style="height:24px"></div><span class="bar-val">1</span><span class="bar-label">Thu</span></div>
      <div class="bar-wrap"><div class="bar" style="height:56px"></div><span class="bar-val">3</span><span class="bar-label">Fri</span></div>
      <div class="bar-wrap"><div class="bar" style="height:24px"></div><span class="bar-val">1</span><span class="bar-label">Sat</span></div>
      <div class="bar-wrap"><div class="bar" style="height:40px"></div><span class="bar-val">2</span><span class="bar-label">Sun</span></div>
    </div>
  </div>
  <div class="summary-footer">
    <div class="sf-item"><div class="sf-val">12</div><div class="sf-lbl">Best Streak</div></div>
    <div class="sf-item"><div class="sf-val">5</div><div class="sf-lbl">PB's</div></div>
    <div class="sf-item"><div class="sf-val">42</div><div class="sf-lbl">Rank</div></div>
  </div>
  <div style="height:8px"></div>
</div>
<div class="pf-nav">
  <a href="home.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 10l9-7 9 7"/><path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"/></svg>Home</a>
  <a href="stats.html" class="nav-item active">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>Stats</a>
  <a href="community.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>Feed</a>
  <a href="profile.html" class="nav-item" style="border-right:none">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>Profile</a>
</div>
</body>
</html>
