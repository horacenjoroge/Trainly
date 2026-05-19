<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Home Dashboard</title>
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
  --border-w:3px;
}
html{background:#E5E5E5}
body{font-family:var(--font-body);background:var(--surface);max-width:412px;margin:var(--space-xl) auto;border:4px solid var(--border);min-height:844px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.pf-status{display:flex;align-items:center;justify-content:space-between;padding:var(--space-sm) var(--space-lg);font-size:11px;font-weight:700;font-family:var(--font-mono);background:var(--surface);border-bottom:2px solid var(--border)}
.pf-icons{display:flex;gap:4px;align-items:center}
.pf-icons svg{display:block}

.top-bar{display:flex;align-items:center;justify-content:space-between;padding:var(--space-md) var(--space-lg);border-bottom:3px solid var(--border)}
.top-bar .title{font-size:21px;font-weight:900;letter-spacing:-0.02em;display:flex;align-items:center;gap:var(--space-sm)}
.top-bar .title span{display:inline-block;width:10px;height:10px;background:var(--accent);border:2px solid var(--border);transform:rotate(12deg)}
.top-bar .actions{display:flex;gap:var(--space-md)}
.top-bar .actions .a{width:28px;height:28px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface);transition:all .08s}
.top-bar .actions .a:active{transform:translate(1px,1px)}

.scroll{flex:1;overflow-y:auto;padding:var(--space-lg) var(--space-lg) 0;display:flex;flex-direction:column;gap:var(--space-lg)}
.section-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);display:flex;align-items:center;justify-content:space-between}
.section-label .see-all{font-size:11px;color:var(--fg);font-weight:800;cursor:pointer;border-bottom:2px solid var(--accent);text-decoration:none}

.progress-card{border:3px solid var(--border);padding:var(--space-lg);background:var(--surface);transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--border)}
.progress-card .pc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}
.progress-card .pc-head h3{font-size:17px;font-weight:800}
.progress-card .pc-head .view{font-size:12px;font-weight:700;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent}
.progress-card .pc-head .view:hover{border-color:var(--accent)}
.pc-stats{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm)}
.pc-stat{border:2px solid var(--border);padding:var(--space-md);text-align:center}
.pc-stat .num{font-size:27px;font-weight:900;letter-spacing:-0.02em;line-height:1}
.pc-stat .num .accent{color:var(--accent)}
.pc-stat .label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-top:var(--space-xs)}
.pc-stat.wide{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;text-align:left}
.pc-stat.wide .num{font-size:17px}
.pc-stat.wide .label{font-size:10px;margin-top:0}

.quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md)}
.qa-card{border:3px solid var(--border);padding:var(--space-lg);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);cursor:pointer;transition:all .08s;display:flex;flex-direction:column;align-items:center;gap:var(--space-sm);text-align:center;text-decoration:none;color:var(--fg)}
.qa-card:active{transform:translate(0,0);box-shadow:none}
.qa-card .qa-icon{width:40px;height:40px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:20px;background:var(--accent)}
.qa-card .qa-label{font-weight:800;font-size:13px}

.feed-item{border:3px solid var(--border);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.feed-item .fi-head{display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);border-bottom:2px solid var(--border)}
.feed-item .fi-head .avatar{width:32px;height:32px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;flex-shrink:0;background:var(--accent)}
.feed-item .fi-head .fi-name{font-weight:700;font-size:13px}
.feed-item .fi-head .fi-time{font-size:11px;color:var(--muted);margin-left:auto}
.feed-item .fi-body{padding:var(--space-md)}
.feed-item .fi-body p{font-size:14px;line-height:1.5}
.feed-item .fi-body .wb{margin-top:var(--space-sm);border:2px solid var(--border);padding:var(--space-sm);display:flex;align-items:center;gap:var(--space-sm);font-size:12px;font-weight:600;background:var(--accent)}
.feed-item .fi-foot{display:flex;gap:var(--space-xl);padding:var(--space-sm) var(--space-md);border-top:2px solid var(--border);font-size:12px;font-weight:600;color:var(--muted)}
.feed-item .fi-foot span{cursor:pointer}
.feed-item .fi-foot span:hover{color:var(--fg)}

.na-card{border:3px solid var(--border);padding:var(--space-xl);display:flex;flex-direction:column;align-items:center;gap:var(--space-md);text-align:center;background:var(--surface)}
.na-card .na-icon{font-size:36px}
.na-card .na-title{font-weight:800;font-size:17px}
.na-card .na-desc{font-size:13px;color:var(--muted)}

.pf-nav{display:flex;border-top:4px solid var(--border);background:var(--surface);margin-top:auto}
.nav-item{flex:1;padding:var(--space-sm);text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-right:3px solid var(--border);cursor:pointer;color:var(--muted);text-decoration:none;transition:all .08s}
.nav-item:last-child{border-right:none}
.nav-item.active{background:var(--accent);color:var(--fg)}
.nav-item .nav-svg{display:block;width:20px;height:20px;margin:0 auto var(--space-xs)}
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
  <div class="title"><span></span> Trainly</div>
  <div class="actions">
    <a href="#" class="a">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    </a>
    <a href="profile.html" class="a">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>
    </a>
  </div>
</div>

<div class="scroll">

  <div class="progress-card">
    <div class="pc-head">
      <h3>My Progress</h3>
      <a href="stats.html" class="view">View Stats →</a>
    </div>
    <div class="pc-stats">
      <div class="pc-stat">
        <div class="num"><span class="accent">12</span></div>
        <div class="label">Workouts</div>
      </div>
      <div class="pc-stat">
        <div class="num">9<span style="font-size:13px;font-weight:500;color:var(--muted)">h</span></div>
        <div class="label">Total Time</div>
      </div>
      <div class="pc-stat wide">
        <div>
          <div class="num">4,200</div>
          <div class="label">Calories Burned</div>
        </div>
        <div style="font-size:11px;font-weight:700;color:var(--muted)">🔥 on fire</div>
      </div>
    </div>
  </div>

  <div class="quick-actions">
    <a href="training.html" class="qa-card">
      <div class="qa-icon">▶</div>
      <div class="qa-label">Start Training</div>
    </a>
    <a href="history.html" class="qa-card">
      <div class="qa-icon" style="background:var(--surface)">📋</div>
      <div class="qa-label">History</div>
    </a>
  </div>

  <div class="section-label">
    <span>Community Feed</span>
    <a href="community.html" class="see-all">See All</a>
  </div>

  <div class="feed-item">
    <div class="fi-head">
      <div class="avatar">AC</div>
      <div>
        <div class="fi-name">Alex Chen</div>
        <div style="font-size:11px;color:var(--muted)">2h ago</div>
      </div>
      <span class="fi-time">🏃 Running</span>
    </div>
    <div class="fi-body">
      <p>New PB on the trail today! Felt strong the whole way.</p>
      <div class="wb">🏃 5.2 km · 28 min · 5:12 /km</div>
    </div>
    <div class="fi-foot">
      <span>❤️ 24</span>
      <span>💬 3</span>
    </div>
  </div>

  <div class="feed-item">
    <div class="fi-head">
      <div class="avatar" style="background:#432DD7;color:#fff">JR</div>
      <div>
        <div class="fi-name">Jordan Rivera</div>
        <div style="font-size:11px;color:var(--muted)">5h ago</div>
      </div>
      <span class="fi-time">🚴 Cycling</span>
    </div>
    <div class="fi-body">
      <p>Morning ride was brutal but worth it. New segment record!</p>
      <div class="wb">🚴 32 km · 1h 12min</div>
    </div>
    <div class="fi-foot">
      <span>❤️ 18</span>
      <span>💬 5</span>
    </div>
  </div>

  <div class="feed-item">
    <div class="fi-head">
      <div class="avatar" style="background:#16A34A;color:#fff">SP</div>
      <div>
        <div class="fi-name">Sam Patel</div>
        <div style="font-size:11px;color:var(--muted)">Yesterday</div>
      </div>
      <span class="fi-time">🏋️ Gym</span>
    </div>
    <div class="fi-body">
      <p>Finally hit 100kg bench press! 3 months of work 💪</p>
    </div>
    <div class="fi-foot">
      <span>❤️ 42</span>
      <span>💬 7</span>
    </div>
  </div>

  <div style="height:var(--space-md)"></div>
</div>

<div class="pf-nav">
  <a href="home.html" class="nav-item active">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M3 10l9-7 9 7"/><path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"/></svg>
    Home
  </a>
  <a href="stats.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
    Stats
  </a>
  <a href="community.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
    Feed
  </a>
  <a href="profile.html" class="nav-item" style="border-right:none">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>
    Profile
  </a>
</div>

</body>
</html>
