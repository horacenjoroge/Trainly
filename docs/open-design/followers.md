<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Followers & Following</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;--success:#16A34A;
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
.scroll{flex:1;overflow-y:auto;padding:12px 16px 16px;display:flex;flex-direction:column;gap:8px}
.user-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border:2px solid var(--border);background:var(--surface);text-decoration:none;color:var(--fg);cursor:pointer}
.user-row:active{background:#f0f0f0}
.user-row .avatar{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;flex-shrink:0}
.user-row .ui{flex:1}
.user-row .ui .uname{font-weight:700;font-size:14px}
.user-row .ui .ubio{font-size:11px;color:var(--muted)}
.user-row .ur-action{padding:4px 14px;border:2px solid var(--border);font-weight:700;font-size:11px;cursor:pointer;font-family:var(--font-body);background:var(--surface);transition:all .08s}
.user-row .ur-action:active{background:var(--accent)}
.user-row .ur-action.following{background:var(--accent)}
.list-hidden{display:none}
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
  <div class="title">Followers</div>
</div>
<div class="tab-bar">
  <span class="tab-item active" onclick="switchTab('followers',this)">Followers 128</span>
  <span class="tab-item" onclick="switchTab('following',this)">Following 94</span>
</div>
<div class="scroll" id="followersList">
  <a href="user-profile.html?u=3" class="user-row">
    <div class="avatar" style="background:#16A34A;color:#fff">SP</div>
    <div class="ui"><div class="uname">Sam Patel</div><div class="ubio">Powerlifter</div></div>
    <span class="ur-action" onclick="event.preventDefault();this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Follow</span>
  </a>
  <a href="user-profile.html?u=4" class="user-row">
    <div class="avatar" style="background:#D97706;color:#fff">MT</div>
    <div class="ui"><div class="uname">Maya Thompson</div><div class="ubio">Triathlete</div></div>
    <span class="ur-action following" onclick="event.preventDefault();this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Following</span>
  </a>
  <a href="user-profile.html?u=6" class="user-row">
    <div class="avatar" style="background:var(--accent)">LK</div>
    <div class="ui"><div class="uname">Lena Kim</div><div class="ubio">Runner</div></div>
    <span class="ur-action" onclick="event.preventDefault();this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Follow</span>
  </a>
  <a href="user-profile.html?u=7" class="user-row">
    <div class="avatar" style="background:#DC2626;color:#fff">JW</div>
    <div class="ui"><div class="uname">James Wilson</div><div class="ubio">Cyclist</div></div>
    <span class="ur-action" onclick="event.preventDefault();this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Follow</span>
  </a>
  <div style="height:8px"></div>
</div>
<div class="scroll list-hidden" id="followingList">
  <a href="user-profile.html?u=2" class="user-row">
    <div class="avatar" style="background:#432DD7;color:#fff">JR</div>
    <div class="ui"><div class="uname">Jordan Rivera</div><div class="ubio">Cyclist</div></div>
    <span class="ur-action following" onclick="event.preventDefault();this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Following</span>
  </a>
  <a href="user-profile.html?u=5" class="user-row">
    <div class="avatar" style="background:var(--accent)">CR</div>
    <div class="ui"><div class="uname">Carlos Ruiz</div><div class="ubio">Trail runner</div></div>
    <span class="ur-action following" onclick="event.preventDefault();this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Following</span>
  </a>
  <a href="user-profile.html?u=8" class="user-row">
    <div class="avatar" style="background:#16A34A;color:#fff">PS</div>
    <div class="ui"><div class="uname">Priya Sharma</div><div class="ubio">Swimmer</div></div>
    <span class="ur-action" onclick="event.preventDefault();this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Follow</span>
  </a>
  <div style="height:8px"></div>
</div>
<script>
function switchTab(tab,el){
  document.querySelectorAll('.tab-item').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('followersList').style.display=tab==='followers'?'':'none';
  document.getElementById('followingList').style.display=tab==='following'?'':'none';
  document.querySelector('.top-bar .title').textContent=tab==='followers'?'Followers':'Following';
}
</script>
</body>
</html>
