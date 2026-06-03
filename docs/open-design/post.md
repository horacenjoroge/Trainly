<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Create Post</title>
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
.top-bar .back{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.top-bar .back:active{transform:translate(1px,1px)}
.top-bar .title{font-size:17px;font-weight:800}
.top-bar .post-btn{padding:6px 16px;border:2px solid var(--border);font-weight:800;font-size:12px;font-family:var(--font-body);cursor:pointer;background:var(--accent);transition:all .08s}
.top-bar .post-btn:active{transform:translate(1px,1px)}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.user-row{display:flex;align-items:center;gap:12px;margin-bottom:4px}
.user-row .avatar{width:40px;height:40px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;background:var(--accent)}
.user-row .uname{font-weight:700;font-size:15px}
textarea{width:100%;border:3px solid var(--border);padding:12px;font-family:var(--font-body);font-size:15px;line-height:1.6;resize:none;min-height:120px;outline:none;background:var(--surface);color:var(--fg);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s}
textarea:focus{border-color:var(--accent)}
textarea::placeholder{color:var(--muted)}
.attach-row{display:flex;gap:8px;flex-wrap:wrap}
.attach-chip{display:flex;align-items:center;gap:6px;padding:8px 16px;border:2px solid var(--border);font-weight:700;font-size:13px;cursor:pointer;transition:all .08s;background:var(--surface);font-family:var(--font-body)}
.attach-chip:active{background:var(--accent)}
.attach-chip.selected{background:var(--accent)}
.workout-select{border:3px solid var(--border);padding:16px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.workout-select .ws-title{font-weight:800;font-size:15px;margin-bottom:12px}
.workout-option{display:flex;align-items:center;gap:12px;padding:10px 12px;border:2px solid var(--border);cursor:pointer;transition:all .08s;margin-bottom:8px}
.workout-option:last-child{margin-bottom:0}
.workout-option:active{background:var(--accent)}
.workout-option .wo-icon{width:32px;height:32px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.workout-option .wo-info{flex:1}
.workout-option .wo-info .wo-type{font-weight:700;font-size:14px}
.workout-option .wo-info .wo-meta{font-size:12px;color:var(--muted)}
.workout-option .wo-check{width:24px;height:24px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:800}
.workout-option.selected .wo-check{background:var(--accent)}
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
  <div class="title">Create Post</div>
  <button class="post-btn" onclick="submitPost()">Post</button>
</div>
<div class="scroll">
  <div class="user-row">
    <div class="avatar">AJ</div>
    <div class="uname">Alex Johnson</div>
  </div>
  <textarea placeholder="What's your latest workout? Share your progress, route, or PR..." id="postContent">Great morning run — new route discovered!</textarea>
  <div class="attach-row">
    <span class="attach-chip">📷 Photo</span>
    <span class="attach-chip selected" id="attachWk" onclick="toggleWorkout()">🏃 Attach Workout</span>
    <span class="attach-chip">📍 Location</span>
  </div>
  <div class="workout-select" id="workoutSection">
    <div class="ws-title">Select a recent workout</div>
    <div class="workout-option selected" onclick="selectWorkout(this)">
      <div class="wo-icon">🏃</div>
      <div class="wo-info">
        <div class="wo-type">Morning Run</div>
        <div class="wo-meta">Today · 5.2 km · 28 min</div>
      </div>
      <div class="wo-check">✓</div>
    </div>
    <div class="workout-option" onclick="selectWorkout(this)">
      <div class="wo-icon">🏋️</div>
      <div class="wo-info">
        <div class="wo-type">Push Day</div>
        <div class="wo-meta">Yesterday · 8 exercises · 45 min</div>
      </div>
      <div class="wo-check"></div>
    </div>
  </div>
  <div style="height:8px"></div>
</div>
<script>
function selectWorkout(el){
  document.querySelectorAll('.workout-option').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
}
function toggleWorkout(){
  const section=document.getElementById('workoutSection');
  const chip=document.getElementById('attachWk');
  section.style.display=section.style.display==='none'?'':'none';
  chip.classList.toggle('selected');
}
function submitPost(){
  const content=document.getElementById('postContent').value.trim();
  if(!content){alert('Please write something!');return;}
  alert('Post shared to community! 🎉');
  window.location='community.html';
}
</script>
</body>
</html>
