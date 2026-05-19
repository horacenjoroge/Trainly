<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Find Friends</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
  --success:#16A34A;
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
.search-bar{display:flex;align-items:center;gap:8px;margin:12px 16px 0;border:3px solid var(--border);padding:0 12px;background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.search-bar input{flex:1;border:none;outline:none;padding:12px 0;font-size:14px;font-family:var(--font-body);font-weight:600;color:var(--fg);background:transparent}
.search-bar input::placeholder{color:var(--muted);font-weight:500}
.search-bar .s-icon{color:var(--muted)}
.scroll{flex:1;overflow-y:auto;padding:12px 16px 16px;display:flex;flex-direction:column;gap:8px}
.section-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-top:8px}
.user-row{display:flex;align-items:center;gap:12px;padding:12px;border:2px solid var(--border);background:var(--surface);cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.user-row:active{transform:translate(1px,1px)}
.user-row .avatar{width:40px;height:40px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;flex-shrink:0}
.user-row .ui{flex:1}
.user-row .ui .uname{font-weight:700;font-size:14px}
.user-row .ui .ubio{font-size:12px;color:var(--muted)}
.user-row .ur-action{padding:6px 16px;border:2px solid var(--border);font-weight:700;font-size:12px;cursor:pointer;font-family:var(--font-body);background:var(--surface);transition:all .08s}
.user-row .ur-action:active{background:var(--accent)}
.user-row .ur-action.following{background:var(--success);color:#fff;border-color:var(--success)}
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
  <div class="title">Find Friends</div>
</div>
<div class="search-bar">
  <span class="s-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
  </span>
  <input type="text" placeholder="Search by name..." id="searchFriends" oninput="filterFriends(this.value)">
</div>
<div class="scroll">
  <div class="section-label">Suggested Athletes</div>
  <a href="user-profile.html?u=2" class="user-row">
    <div class="avatar" style="background:#432DD7;color:#fff">JR</div>
    <div class="ui"><div class="uname">Jordan Rivera</div><div class="ubio">Cyclist · 2,400 km this year</div></div>
    <span class="ur-action" onclick="event.preventDefault();followUser(this)">Follow</span>
  </a>
  <a href="user-profile.html?u=3" class="user-row">
    <div class="avatar" style="background:#16A34A;color:#fff">SP</div>
    <div class="ui"><div class="uname">Sam Patel</div><div class="ubio">Powerlifter · 100kg bench</div></div>
    <span class="ur-action" onclick="event.preventDefault();followUser(this)">Follow</span>
  </a>
  <a href="user-profile.html?u=4" class="user-row">
    <div class="avatar" style="background:#D97706;color:#fff">MT</div>
    <div class="ui"><div class="uname">Maya Thompson</div><div class="ubio">Triathlete · Ironman finisher</div></div>
    <span class="ur-action following" onclick="event.preventDefault();followUser(this)">Following</span>
  </a>
  <a href="user-profile.html?u=5" class="user-row">
    <div class="avatar" style="background:#DC2626;color:#fff">CR</div>
    <div class="ui"><div class="uname">Carlos Ruiz</div><div class="ubio">Trail runner · Ultra marathoner</div></div>
    <span class="ur-action" onclick="event.preventDefault();followUser(this)">Follow</span>
  </a>
  <a href="user-profile.html?u=6" class="user-row">
    <div class="avatar" style="background:var(--accent)">LK</div>
    <div class="ui"><div class="uname">Lena Kim</div><div class="ubio">Runner · Half marathon prep</div></div>
    <span class="ur-action following" onclick="event.preventDefault();followUser(this)">Following</span>
  </a>
  <div style="height:8px"></div>
</div>
<script>
function followUser(el){
  el.classList.toggle('following');
  el.textContent=el.classList.contains('following')?'Following':'Follow';
}
function filterFriends(val){
  const rows=document.querySelectorAll('.user-row');
  rows.forEach(r=>{
    const name=r.querySelector('.uname').textContent.toLowerCase();
    r.style.display=name.includes(val.toLowerCase())?'':'none';
  });
}
</script>
</body>
</html>
