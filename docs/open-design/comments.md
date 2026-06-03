<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Comments</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
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
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.origin-post{border:3px solid var(--border);padding:12px;background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.origin-post .op-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.origin-post .op-head .avatar{width:28px;height:28px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;background:var(--accent)}
.origin-post .op-head .op-name{font-weight:700;font-size:13px}
.origin-post .op-text{font-size:13px;line-height:1.5;color:var(--muted)}
.comment-count{font-size:13px;font-weight:700;color:var(--muted);display:flex;align-items:center;gap:8px}
.comment-card{border:2px solid var(--border);padding:12px;background:var(--surface)}
.comment-card .cm-head{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.comment-card .cm-head .avatar{width:28px;height:28px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px}
.comment-card .cm-head .cm-name{font-weight:700;font-size:13px}
.comment-card .cm-head .cm-time{font-size:11px;color:var(--muted);margin-left:auto}
.comment-card .cm-text{font-size:13px;line-height:1.5}
.comment-card .cm-actions{display:flex;gap:16px;margin-top:6px;font-size:12px;color:var(--muted);font-weight:600}
.comment-card .cm-actions span{cursor:pointer}
.comment-card .cm-actions span:hover{color:var(--fg)}
.comment-input{display:flex;gap:8px;align-items:stretch;margin-bottom:4px}
.comment-input input{flex:1;border:3px solid var(--border);padding:12px;font-family:var(--font-body);font-size:14px;outline:none;background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.comment-input input:focus{border-color:var(--accent)}
.comment-input button{padding:12px 20px;border:3px solid var(--border);font-weight:800;font-size:13px;cursor:pointer;background:var(--accent);font-family:var(--font-body);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s}
.comment-input button:active{transform:translate(0,0);box-shadow:none}
.empty-state{display:none;padding:48px 24px;text-align:center;flex-direction:column;align-items:center;gap:12px}
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
  <a href="community.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">Comments</div>
</div>
<div class="scroll">
  <div class="origin-post">
    <div class="op-head">
      <div class="avatar">AC</div>
      <div class="op-name">Alex Chen</div>
    </div>
    <div class="op-text">New PB on the trail today! Felt strong the whole way.</div>
  </div>
  <div class="comment-count">💬 3 comments</div>
  <div class="comment-card">
    <div class="cm-head">
      <div class="avatar" style="background:#432DD7;color:#fff">JR</div>
      <div class="cm-name">Jordan Rivera</div>
      <span class="cm-time">1h ago</span>
    </div>
    <div class="cm-text">Nice work! Which trail did you hit?</div>
    <div class="cm-actions"><span>❤️ 2</span><span>Reply</span></div>
  </div>
  <div class="comment-card">
    <div class="cm-head">
      <div class="avatar" style="background:#16A34A;color:#fff">SP</div>
      <div class="cm-name">Sam Patel</div>
      <span class="cm-time">2h ago</span>
    </div>
    <div class="cm-text">Beast mode 🔥 That pace is solid for a trail run</div>
    <div class="cm-actions"><span>❤️ 5</span><span>Reply</span></div>
  </div>
  <div class="comment-card">
    <div class="cm-head">
      <div class="avatar" style="background:var(--accent)">LK</div>
      <div class="cm-name">Lena Kim</div>
      <span class="cm-time">3h ago</span>
    </div>
    <div class="cm-text">Let's run together this weekend! Same route?</div>
    <div class="cm-actions"><span>❤️ 3</span><span>Reply</span></div>
  </div>
  <div class="comment-input">
    <input type="text" placeholder="Write a comment..." id="commentInput">
    <button onclick="postComment()">Send</button>
  </div>
  <div style="height:8px"></div>
</div>
<script>
function postComment(){
  const input=document.getElementById('commentInput');
  const text=input.value.trim();
  if(!text)return;
  const scroll=document.querySelector('.scroll');
  const card=document.createElement('div');
  card.className='comment-card';
  card.innerHTML=`<div class="cm-head"><div class="avatar" style="background:var(--accent)">AJ</div><div class="cm-name">Alex Johnson</div><span class="cm-time">Just now</span></div><div class="cm-text">${text}</div><div class="cm-actions"><span>❤️ 0</span><span>Reply</span></div>`;
  scroll.insertBefore(card,scroll.querySelector('.comment-input').parentElement);
  input.value='';
  document.querySelector('.comment-count').textContent='💬 '+(parseInt(document.querySelector('.comment-count').textContent.match(/\d+/)[0])+1)+' comments';
}
</script>
</body>
</html>
