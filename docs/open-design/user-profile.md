<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — User Profile</title>
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
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.profile-hero{text-align:center;padding:16px;border:3px solid var(--border);transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--border)}
.profile-hero .ph-avatar{width:72px;height:72px;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;margin:0 auto 12px;background:var(--accent)}
.profile-hero .ph-name{font-size:24px;font-weight:900;letter-spacing:-0.02em}
.profile-hero .ph-bio{font-size:13px;color:var(--muted);margin-top:4px;max-width:280px;margin-left:auto;margin-right:auto}
.profile-hero .ph-actions{display:flex;gap:8px;justify-content:center;margin-top:12px}
.profile-hero .ph-actions button{padding:8px 20px;border:2px solid var(--border);font-weight:800;font-size:13px;cursor:pointer;font-family:var(--font-body);transition:all .08s}
.profile-hero .ph-actions button:active{transform:translate(1px,1px)}
.profile-hero .ph-actions .follow{background:var(--accent)}
.profile-hero .ph-actions .msg{background:var(--surface)}
.stats-row{display:flex;gap:0;border:3px solid var(--border);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.stat-cell{flex:1;padding:12px;text-align:center;border-right:2px solid var(--border)}
.stat-cell:last-child{border-right:none}
.stat-cell .sc-val{font-size:21px;font-weight:900}
.stat-cell .sc-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.section-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);display:flex;align-items:center;justify-content:space-between}
.feed-item{border:3px solid var(--border);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.feed-item .fi-head{display:flex;align-items:center;gap:12px;padding:12px;border-bottom:2px solid var(--border)}
.feed-item .fi-head .fi-type{width:32px;height:32px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px}
.feed-item .fi-head .fi-info{flex:1}
.feed-item .fi-head .fi-info .fi-wtype{font-weight:700;font-size:14px}
.feed-item .fi-head .fi-info .fi-date{font-size:11px;color:var(--muted)}
.feed-item .fi-head .fi-arrow{font-size:14px;color:var(--muted)}
.feed-item .fi-body{padding:12px;font-size:13px;line-height:1.5}
.feed-item .fi-foot{display:flex;gap:16px;padding:8px 12px;border-top:2px solid var(--border);font-size:12px;color:var(--muted);font-weight:600}
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
  <a href="community.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">Profile</div>
</div>
<div class="scroll">
  <div class="profile-hero">
    <div class="ph-avatar">AC</div>
    <div class="ph-name">Alex Chen</div>
    <div class="ph-bio">Runner & weekend cyclist. Marathon PB: 3:45.</div>
    <div class="ph-actions">
      <button class="follow" id="followBtn" onclick="toggleFollow()">+ Follow</button>
      <button class="msg" onclick="alert('Message Alex (mock)')">Message</button>
    </div>
  </div>
  <div class="stats-row">
    <div class="stat-cell"><div class="sc-val">128</div><div class="sc-lbl">Followers</div></div>
    <div class="stat-cell"><div class="sc-val">94</div><div class="sc-lbl">Following</div></div>
    <div class="stat-cell" style="border-right:none"><div class="sc-val">12</div><div class="sc-lbl">Workouts</div></div>
  </div>
  <div class="section-label">Recent Activity</div>
  <div class="feed-item">
    <div class="fi-head">
      <div class="fi-type">🏃</div>
      <div class="fi-info"><div class="fi-wtype">Morning Run</div><div class="fi-date">Today · 5.2 km</div></div>
      <div class="fi-arrow">→</div>
    </div>
    <div class="fi-body">New PB on the trail today! Felt strong the whole way.</div>
    <div class="fi-foot"><span>❤️ 24</span><span>💬 3</span></div>
  </div>
  <div class="feed-item">
    <div class="fi-head">
      <div class="fi-type">🚴</div>
      <div class="fi-info"><div class="fi-wtype">Evening Ride</div><div class="fi-date">Yesterday · 32 km</div></div>
      <div class="fi-arrow">→</div>
    </div>
    <div class="fi-body">New segment record on River Road!</div>
    <div class="fi-foot"><span>❤️ 18</span><span>💬 2</span></div>
  </div>
  <div style="height:8px"></div>
</div>
<script>
let following=false;
function toggleFollow(){
  const btn=document.getElementById('followBtn');
  following=!following;
  btn.textContent=following?'Following ✓':'+ Follow';
  btn.style.background=following?'var(--success)':'var(--accent)';
  btn.style.color=following?'#fff':'var(--fg)';
}
</script>
</body>
</html>
