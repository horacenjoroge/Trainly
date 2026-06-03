<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Workout Detail</title>
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
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.hero-detail{background:var(--accent);border:3px solid var(--border);padding:24px;margin:-16px -16px 0;text-align:center;transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--border)}
.hero-detail .hd-icon{font-size:40px;margin-bottom:8px}
.hero-detail .hd-type{font-size:24px;font-weight:900;letter-spacing:-0.02em}
.hero-detail .hd-date{font-size:13px;font-weight:600;color:var(--muted);margin-top:4px}
.hero-detail .hd-actions{display:flex;gap:8px;margin-top:16px;justify-content:center}
.hero-detail .hd-actions button{padding:6px 16px;border:2px solid var(--border);font-weight:700;font-size:12px;cursor:pointer;font-family:var(--font-body);background:var(--surface);transition:all .08s;display:flex;align-items:center;gap:4px}
.hero-detail .hd-actions button:active{background:var(--fg);color:#fff}
.metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.metric-card{border:2px solid var(--border);padding:16px;text-align:center;background:var(--surface)}
.metric-card .mc-val{font-size:27px;font-weight:900;letter-spacing:-0.02em}
.metric-card .mc-val .accent{color:var(--accent)}
.metric-card .mc-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-top:2px}
.metric-card.wide{grid-column:1/-1;display:flex;justify-content:space-between;text-align:left;align-items:center}
.metric-card.wide .mc-val{font-size:17px}
.section-title{font-size:15px;font-weight:800;display:flex;align-items:center;justify-content:space-between}
.section-title .see{font-size:12px;color:var(--muted);font-weight:600;cursor:pointer}
.map-mini{border:3px solid var(--border);height:120px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--muted);font-weight:600;position:relative;overflow:hidden}
.map-mini .line{position:absolute;inset:0}
.map-mini .line::before{content:'';position:absolute;top:40%;left:5%;width:90%;height:3px;background:var(--accent);transform:rotate(-8deg)}
.map-mini .line::after{content:'';position:absolute;top:60%;left:10%;width:75%;height:3px;background:var(--accent);transform:rotate(5deg)}
.map-mini .dot{position:absolute;top:35%;left:10%;width:8px;height:8px;background:var(--accent);border:2px solid var(--border);border-radius:50%}
.split-list{display:flex;flex-direction:column;gap:4px}
.split-row{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border:2px solid var(--border);font-size:13px;font-weight:600}
.split-row .sr-km{color:var(--muted);font-weight:700}
.split-row .sr-time{font-family:var(--font-mono);font-variant-numeric:tabular-nums}
.split-row .sr-pace{color:var(--muted)}
.empty-state{padding:48px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.empty-state .es-icon{font-size:48px}
.empty-state .es-title{font-weight:800;font-size:17px}
.empty-state .es-desc{font-size:13px;color:var(--muted)}
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
  <a href="history.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">Workout Details</div>
</div>
<div class="scroll">
  <div class="hero-detail">
    <div class="hd-icon">🏃</div>
    <div class="hd-type">Morning Run</div>
    <div class="hd-date">Today · 06:32 · 5.2 km</div>
    <div class="hd-actions">
      <button onclick="alert('Shared to feed!')">📤 Share</button>
      <button onclick="alert('Workout exported')">⬇ Export</button>
    </div>
  </div>
  <div class="metrics-grid">
    <div class="metric-card"><div class="mc-val">28:14</div><div class="mc-lbl">Duration</div></div>
    <div class="metric-card"><div class="mc-val">5.2<span style="font-size:13px;font-weight:500;color:var(--muted)"> km</span></div><div class="mc-lbl">Distance</div></div>
    <div class="metric-card"><div class="mc-val">5:12</div><div class="mc-lbl">Avg Pace</div></div>
    <div class="metric-card"><div class="mc-val">380</div><div class="mc-lbl">Calories</div></div>
    <div class="metric-card"><div class="mc-val">152</div><div class="mc-lbl">Avg HR</div></div>
    <div class="metric-card"><div class="mc-val">42<span style="font-size:13px;font-weight:500;color:var(--muted)">m</span></div><div class="mc-lbl">Elevation</div></div>
  </div>
  <div class="section-title">Route <span class="see" onclick="alert('Route expanded')">View Full</span></div>
  <div class="map-mini">
    <span>📍 GPS Route</span>
    <div class="line"></div>
    <div class="dot"></div>
  </div>
  <div class="section-title">Splits <span class="see">5:12 avg</span></div>
  <div class="split-list">
    <div class="split-row"><span class="sr-km">KM 1</span><span class="sr-time">5:02</span><span class="sr-pace">5:02</span></div>
    <div class="split-row"><span class="sr-km">KM 2</span><span class="sr-time">5:15</span><span class="sr-pace">5:15</span></div>
    <div class="split-row"><span class="sr-km">KM 3</span><span class="sr-time" style="color:var(--success);font-weight:800">4:58</span><span class="sr-pace">4:58</span></div>
    <div class="split-row"><span class="sr-km">KM 4</span><span class="sr-time">5:22</span><span class="sr-pace">5:22</span></div>
    <div class="split-row"><span class="sr-km">KM 5</span><span class="sr-time">5:08</span><span class="sr-pace">5:08</span></div>
    <div class="split-row"><span class="sr-km">+0.2</span><span class="sr-time">1:29</span><span class="sr-pace">—</span></div>
  </div>
  <div style="height:8px"></div>
</div>
</body>
</html>
