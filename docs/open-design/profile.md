<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — My Profile</title>
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
.top-bar .actions .a{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.top-bar .actions .a:active{background:var(--accent)}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.profile-hero{text-align:center;padding:24px 16px;border:3px solid var(--border);transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--border)}
.profile-hero .ph-avatar{width:80px;height:80px;border:4px solid var(--border);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;background:var(--accent)}
.profile-hero .ph-name{font-size:27px;font-weight:900;letter-spacing:-0.02em}
.profile-hero .ph-bio{font-size:13px;color:var(--muted);margin-top:4px;max-width:300px;margin-left:auto;margin-right:auto}
.stats-row{display:flex;gap:0;border:3px solid var(--border);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.stat-cell{flex:1;padding:12px;text-align:center;border-right:2px solid var(--border);cursor:pointer;text-decoration:none;color:var(--fg);display:block}
.stat-cell:last-child{border-right:none}
.stat-cell .sc-val{font-size:21px;font-weight:900}
.stat-cell .sc-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.quick-links{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ql-card{border:3px solid var(--border);padding:16px;text-align:center;cursor:pointer;transition:all .08s;text-decoration:none;color:var(--fg);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.ql-card:active{transform:translate(0,0);box-shadow:none}
.ql-card .ql-icon{font-size:28px;margin-bottom:6px}
.ql-card .ql-label{font-weight:800;font-size:13px}
.quick-stats{border:3px solid var(--border);padding:16px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.quick-stats .qs-title{font-weight:800;font-size:15px;margin-bottom:12px}
.qs-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:2px solid var(--border)}
.qs-row:last-child{border-bottom:none}
.qs-row .qs-lbl{font-size:13px;color:var(--muted);font-weight:600}
.qs-row .qs-val{font-weight:900;font-size:15px}
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
  <div class="title">Profile</div>
  <div class="actions">
    <a href="settings.html" class="a">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </a>
  </div>
</div>
<div class="scroll">
  <div class="profile-hero">
    <div class="ph-avatar">AJ</div>
    <div class="ph-name">Alex Johnson</div>
    <div class="ph-bio">Runner & weekend cyclist. Marathon PB: 3:45.</div>
  </div>
  <div class="stats-row">
    <a href="followers.html" class="stat-cell"><div class="sc-val">128</div><div class="sc-lbl">Followers</div></a>
    <a href="followers.html" class="stat-cell"><div class="sc-val">94</div><div class="sc-lbl">Following</div></a>
    <a href="history.html" class="stat-cell" style="border-right:none"><div class="sc-val">12</div><div class="sc-lbl">Workouts</div></a>
  </div>
  <div class="quick-links">
    <a href="history.html" class="ql-card">
      <div class="ql-icon">📋</div>
      <div class="ql-label">History</div>
    </a>
    <a href="achievements.html" class="ql-card">
      <div class="ql-icon">🏆</div>
      <div class="ql-label">Achievements</div>
    </a>
  </div>
  <div class="quick-stats">
    <div class="qs-title">Quick Stats</div>
    <div class="qs-row"><span class="qs-lbl">🔥 Calories</span><span class="qs-val">4,200</span></div>
    <div class="qs-row"><span class="qs-lbl">⏱ Total Hours</span><span class="qs-val">9h</span></div>
    <div class="qs-row"><span class="qs-lbl">🏃 Best Run</span><span class="qs-val">18 km</span></div>
    <div class="qs-row" style="border-bottom:none"><span class="qs-lbl">📅 Member Since</span><span class="qs-val">Jan 2025</span></div>
  </div>
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
