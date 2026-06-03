<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Community Feed</title>
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
.search-bar{display:flex;align-items:center;gap:8px;margin:12px 16px 0;border:3px solid var(--border);padding:0 12px;background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.search-bar input{flex:1;border:none;outline:none;padding:12px 0;font-size:14px;font-family:var(--font-body);font-weight:600;color:var(--fg);background:transparent}
.search-bar input::placeholder{color:var(--muted);font-weight:500}
.search-bar .s-icon{color:var(--muted)}
.scroll{flex:1;overflow-y:auto;padding:12px 16px 16px;display:flex;flex-direction:column;gap:12px}
.post-card{border:3px solid var(--border);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.post-card .pc-head{display:flex;align-items:center;gap:12px;padding:12px;border-bottom:2px solid var(--border);cursor:pointer;text-decoration:none;color:var(--fg)}
.post-card .pc-head .avatar{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0}
.post-card .pc-head .pc-user{font-weight:700;font-size:14px}
.post-card .pc-head .pc-time{font-size:11px;color:var(--muted);margin-left:auto}
.post-card .pc-body{padding:12px}
.post-card .pc-body p{font-size:14px;line-height:1.5;margin-bottom:8px}
.post-card .pc-body .p-workout{border:2px solid var(--border);padding:8px 12px;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;background:var(--accent)}
.post-card .pc-foot{display:flex;gap:0;border-top:2px solid var(--border)}
.post-card .pc-foot .pf-action{flex:1;padding:10px;text-align:center;font-size:13px;font-weight:600;cursor:pointer;border-right:2px solid var(--border);transition:all .08s;color:var(--muted)}
.post-card .pc-foot .pf-action:last-child{border-right:none}
.post-card .pc-foot .pf-action:hover{color:var(--fg)}
.post-card .pc-foot .pf-action.liked{color:var(--danger);font-weight:800}
.empty-state{display:none;padding:48px 24px;text-align:center;flex-direction:column;align-items:center;gap:12px}
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
  <div class="title">👥 Community</div>
  <div class="actions">
    <a href="post.html" class="a">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </a>
  </div>
</div>
<div class="search-bar">
  <span class="s-icon">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
  </span>
  <input type="text" placeholder="Search users..." id="searchInput" oninput="searchUsers(this.value)">
</div>
<div class="scroll" id="feedScroll">
  <div class="post-card">
    <a href="user-profile.html?u=1" class="pc-head">
      <div class="avatar" style="background:var(--accent)">AC</div>
      <div>
        <div class="pc-user">Alex Chen</div>
        <div style="font-size:11px;color:var(--muted)">2h ago</div>
      </div>
      <span class="pc-time">🏃</span>
    </a>
    <div class="pc-body">
      <p>New PB on the trail today! Felt strong the whole way.</p>
      <div class="p-workout">🏃 5.2 km · 28 min · 5:12 /km</div>
    </div>
    <div class="pc-foot">
      <span class="pf-action" onclick="likePost(this)">❤️ 24</span>
      <a href="comments.html?p=1" class="pf-action" style="text-decoration:none">💬 3</a>
    </div>
  </div>
  <div class="post-card">
    <a href="user-profile.html?u=2" class="pc-head">
      <div class="avatar" style="background:#432DD7;color:#fff">JR</div>
      <div>
        <div class="pc-user">Jordan Rivera</div>
        <div style="font-size:11px;color:var(--muted)">5h ago</div>
      </div>
      <span class="pc-time">🚴</span>
    </a>
    <div class="pc-body">
      <p>Morning ride was brutal but worth it. New segment record!</p>
      <div class="p-workout">🚴 32 km · 1h 12min</div>
    </div>
    <div class="pc-foot">
      <span class="pf-action" onclick="likePost(this)">❤️ 18</span>
      <a href="comments.html?p=2" class="pf-action" style="text-decoration:none">💬 5</a>
    </div>
  </div>
  <div class="post-card">
    <a href="user-profile.html?u=3" class="pc-head">
      <div class="avatar" style="background:#16A34A;color:#fff">SP</div>
      <div>
        <div class="pc-user">Sam Patel</div>
        <div style="font-size:11px;color:var(--muted)">Yesterday</div>
      </div>
      <span class="pc-time">🏋️</span>
    </a>
    <div class="pc-body">
      <p>Finally hit 100kg bench press! 3 months of work 💪</p>
    </div>
    <div class="pc-foot">
      <span class="pf-action" onclick="likePost(this)">❤️ 42</span>
      <a href="comments.html?p=3" class="pf-action" style="text-decoration:none">💬 7</a>
    </div>
  </div>
  <div class="post-card">
    <a href="user-profile.html?u=4" class="pc-head">
      <div class="avatar" style="background:#D97706;color:#fff">MT</div>
      <div>
        <div class="pc-user">Maya Thompson</div>
        <div style="font-size:11px;color:var(--muted)">Yesterday</div>
      </div>
      <span class="pc-time">🏊</span>
    </a>
    <div class="pc-body">
      <p>Open water swim at sunrise 🌅</p>
      <div class="p-workout">🏊 2 km · 45 min</div>
    </div>
    <div class="pc-foot">
      <span class="pf-action" onclick="likePost(this)">❤️ 31</span>
      <a href="comments.html?p=4" class="pf-action" style="text-decoration:none">💬 2</a>
    </div>
  </div>
  <div class="post-card">
    <a href="user-profile.html?u=5" class="pc-head">
      <div class="avatar" style="background:#DC2626;color:#fff">CR</div>
      <div>
        <div class="pc-user">Carlos Ruiz</div>
        <div style="font-size:11px;color:var(--muted)">2d ago</div>
      </div>
      <span class="pc-time">🚶</span>
    </a>
    <div class="pc-body">
      <p>Rest day = active recovery walk</p>
      <div class="p-workout">🚶 3 km · 40 min</div>
    </div>
    <div class="pc-foot">
      <span class="pf-action" onclick="likePost(this)">❤️ 8</span>
      <a href="comments.html" class="pf-action" style="text-decoration:none">💬 1</a>
    </div>
  </div>
  <div style="height:8px"></div>
</div>
<div class="pf-nav">
  <a href="home.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 10l9-7 9 7"/><path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"/></svg>Home</a>
  <a href="stats.html" class="nav-item">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>Stats</a>
  <a href="community.html" class="nav-item active">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>Feed</a>
  <a href="profile.html" class="nav-item" style="border-right:none">
    <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>Profile</a>
</div>
<script>
function likePost(el){
  const txt=el.textContent;
  const match=txt.match(/(\d+)/);
  if(match){
    let count=parseInt(match[1]);
    if(el.classList.contains('liked')){
      count--;
      el.classList.remove('liked');
    }else{
      count++;
      el.classList.add('liked');
    }
    el.textContent=txt.startsWith('❤️')?'❤️ '+count:'❤️ '+count;
  }
}
function searchUsers(val){
  const cards=document.querySelectorAll('.post-card');
  const empty=document.querySelector('.empty-state');
  if(!val.trim()){
    cards.forEach(c=>c.style.display='');
    return;
  }
  let found=false;
  cards.forEach(c=>{
    const name=c.querySelector('.pc-user').textContent.toLowerCase();
    if(name.includes(val.toLowerCase())){
      c.style.display='';
      found=true;
    }else{
      c.style.display='none';
    }
  });
}
</script>
</body>
</html>
