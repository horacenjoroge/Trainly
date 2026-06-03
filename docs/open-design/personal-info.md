<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Personal Info</title>
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
.top-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:3px solid var(--border)}
.top-bar .back{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.top-bar .back:active{transform:translate(1px,1px)}
.top-bar .title{font-size:17px;font-weight:800}
.top-bar .save{padding:6px 16px;border:2px solid var(--border);font-weight:800;font-size:12px;cursor:pointer;background:var(--accent);font-family:var(--font-body)}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.avatar-edit{display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px}
.avatar-edit .ae-avatar{width:72px;height:72px;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;background:var(--accent)}
.avatar-edit .ae-change{padding:6px 16px;border:2px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font-body);background:var(--surface)}
.input-group{display:flex;flex-direction:column;gap:4px}
.input-group .label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--muted)}
.input-group input,.input-group textarea{font-family:var(--font-body);font-size:15px;padding:12px;border:3px solid var(--border);outline:none;background:var(--surface);color:var(--fg);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s}
.input-group input:focus,.input-group textarea:focus{border-color:var(--accent)}
.input-group textarea{resize:none;min-height:60px}
.chip-row{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:4px 12px;border:2px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;background:var(--surface);transition:all .08s;font-family:var(--font-body)}
.chip.selected{background:var(--accent)}
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
  <a href="settings.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">Personal Info</div>
  <button class="save" onclick="alert('Changes saved!')">Save</button>
</div>
<div class="scroll">
  <div class="avatar-edit">
    <div class="ae-avatar">AJ</div>
    <span class="ae-change" onclick="alert('Photo picker (mock)')">Change Photo</span>
  </div>
  <div class="input-group">
    <span class="label">Full Name</span>
    <input type="text" value="Alex Johnson">
  </div>
  <div class="input-group">
    <span class="label">Email</span>
    <input type="email" value="alex@trainly.app">
  </div>
  <div class="input-group">
    <span class="label">Bio</span>
    <textarea>Runner & weekend cyclist. Marathon PB: 3:45.</textarea>
  </div>
  <div class="input-group">
    <span class="label">Location</span>
    <input type="text" value="Portland, OR">
  </div>
  <div class="input-group">
    <span class="label">Your Sports</span>
    <div class="chip-row">
      <span class="chip selected">Running</span>
      <span class="chip selected">Cycling</span>
      <span class="chip">Swimming</span>
      <span class="chip selected">Strength</span>
      <span class="chip">Yoga</span>
    </div>
  </div>
  <div style="height:8px"></div>
</div>
<script>
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',function(){this.classList.toggle('selected')}));
</script>
</body>
</html>
