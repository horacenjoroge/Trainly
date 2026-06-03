<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Settings</title>
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
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:8px 0 4px}
.setting-item{display:flex;align-items:center;gap:12px;padding:12px;border:2px solid var(--border);background:var(--surface);cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.setting-item:active{background:var(--accent)}
.setting-item .si-icon{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.setting-item .si-body{flex:1}
.setting-item .si-body .si-title{font-weight:700;font-size:14px}
.setting-item .si-body .si-desc{font-size:12px;color:var(--muted)}
.setting-item .si-arrow{font-size:14px;color:var(--muted)}
.setting-item .si-toggle{width:44px;height:24px;border:2px solid var(--border);border-radius:0;position:relative;cursor:pointer;background:var(--surface);transition:all .1s;flex-shrink:0}
.setting-item .si-toggle.on{background:var(--accent)}
.setting-item .si-toggle::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:var(--border);transition:all .1s}
.setting-item .si-toggle.on::after{left:22px;background:var(--fg)}
.setting-item.logout{border-color:var(--danger);color:var(--danger)}
.setting-item.logout .si-icon{border-color:var(--danger);color:var(--danger)}
.danger-zone{border:3px solid var(--danger);padding:12px;margin-top:8px}
.danger-zone .dz-title{font-weight:800;font-size:13px;color:var(--danger);margin-bottom:8px}
.danger-zone .setting-item{border-color:var(--danger);margin-bottom:4px}
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
  <div class="title">Settings</div>
</div>
<div class="scroll">
  <div class="section-label">Account</div>
  <a href="personal-info.html" class="setting-item">
    <div class="si-icon">👤</div>
    <div class="si-body"><div class="si-title">Personal Info</div><div class="si-desc">Name, email, bio</div></div>
    <div class="si-arrow">→</div>
  </a>
  <a href="edit-stats.html" class="setting-item">
    <div class="si-icon">📊</div>
    <div class="si-body"><div class="si-title">Edit Stats</div><div class="si-desc">Height, weight, goals</div></div>
    <div class="si-arrow">→</div>
  </a>
  <div class="section-label">Preferences</div>
  <div class="setting-item">
    <div class="si-icon">🔔</div>
    <div class="si-body"><div class="si-title">Notifications</div><div class="si-desc">Workout reminders, social alerts</div></div>
    <div class="si-arrow">→</div>
  </div>
  <div class="setting-item" onclick="toggleToggle(this)">
    <div class="si-icon">🌙</div>
    <div class="si-body"><div class="si-title">Dark Mode</div><div class="si-desc">Switch to dark theme</div></div>
    <div class="si-toggle" id="darkToggle"></div>
  </div>
  <div class="setting-item">
    <div class="si-icon">📡</div>
    <div class="si-body"><div class="si-title">GPS Accuracy</div><div class="si-desc">High precision mode</div></div>
    <div class="si-toggle on" id="gpsToggle"></div>
  </div>
  <div class="setting-item">
    <div class="si-icon">📏</div>
    <div class="si-body"><div class="si-title">Units</div><div class="si-desc">Metric / Imperial</div></div>
    <div class="si-arrow">→</div>
  </div>
  <div class="section-label">Privacy & Safety</div>
  <div class="setting-item" onclick="window.location='emergency-contacts.html'">
    <div class="si-icon" style="background:var(--danger);color:#fff;border-color:var(--danger)">🚨</div>
    <div class="si-body"><div class="si-title">Emergency Contacts</div><div class="si-desc">Manage SOS contacts</div></div>
    <div class="si-arrow">→</div>
  </div>
  <div class="setting-item">
    <div class="si-icon">🔒</div>
    <div class="si-body"><div class="si-title">Privacy</div><div class="si-desc">Profile visibility, data sharing</div></div>
    <div class="si-arrow">→</div>
  </div>
  <div class="section-label">Support</div>
  <div class="setting-item">
    <div class="si-icon">❓</div>
    <div class="si-body"><div class="si-title">Help Center</div><div class="si-desc">FAQs, contact support</div></div>
    <div class="si-arrow">→</div>
  </div>
  <div class="setting-item">
    <div class="si-icon">ℹ️</div>
    <div class="si-body"><div class="si-title">About Trainly</div><div class="si-desc">Version 2.0.0</div></div>
    <div class="si-arrow">→</div>
  </div>
  <div class="danger-zone">
    <div class="dz-title">⚠️ Danger Zone</div>
    <div class="setting-item logout" onclick="if(confirm('Log out of Trainly?'))window.location='onboarding.html'">
      <div class="si-icon" style="border-color:var(--danger);color:var(--danger)">🚪</div>
      <div class="si-body"><div class="si-title">Log Out</div></div>
      <div class="si-arrow">→</div>
    </div>
  </div>
  <div style="height:16px"></div>
</div>
<script>
function toggleToggle(el){
  const toggle=el.querySelector('.si-toggle');
  if(toggle)toggle.classList.toggle('on');
}
</script>
</body>
</html>
