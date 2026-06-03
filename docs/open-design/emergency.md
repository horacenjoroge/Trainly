<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Emergency SOS</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
  --success:#16A34A;--danger:#DC2626;--warning:#D97706;
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
.top-bar .title{font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px}
.top-bar .actions{display:flex;gap:8px}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px}
.sos-hero{text-align:center;padding:32px 16px;border:4px solid var(--danger);background:#FEF2F2;transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--danger)}
.sos-hero .sos-icon{font-size:64px;margin-bottom:12px;animation:sosPulse 1s ease-in-out infinite}
@keyframes sosPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
.sos-hero .sos-title{font-size:35px;font-weight:900;color:var(--danger);letter-spacing:-0.02em}
.sos-hero .sos-desc{font-size:14px;color:var(--muted);margin-top:8px;max-width:300px;margin-left:auto;margin-right:auto}
.sos-btn{width:100%;padding:24px;border:4px solid var(--border);font-family:var(--font-body);font-size:24px;font-weight:900;cursor:pointer;background:var(--danger);color:#fff;transform:translate(-3px,-3px);box-shadow:8px 8px 0 var(--border);transition:all .08s;text-transform:uppercase;letter-spacing:.05em}
.sos-btn:active{transform:translate(0,0);box-shadow:none}
.sos-btn:disabled{opacity:.5;transform:none;box-shadow:none}
.sos-active{text-align:center;padding:32px 16px;border:4px solid var(--danger);background:#FEF2F2;display:none;flex-direction:column;align-items:center;gap:16px}
.sos-active.show{display:flex}
.sos-active .sa-timer{font-size:57px;font-weight:900;font-family:var(--font-mono);color:var(--danger);font-variant-numeric:tabular-nums}
.sos-active .sa-text{font-size:17px;font-weight:800}
.sos-active .sa-sub{font-size:13px;color:var(--muted)}
.sos-active .sa-cancel{padding:12px 32px;border:3px solid var(--border);font-weight:800;font-size:15px;cursor:pointer;background:var(--surface);font-family:var(--font-body);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s}
.sos-active .sa-cancel:active{transform:translate(0,0);box-shadow:none}
.contact-preview{border:3px solid var(--border);padding:16px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.contact-preview .cp-title{font-weight:800;font-size:15px;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.contact-preview .cp-item{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:2px solid var(--border)}
.contact-preview .cp-item:last-child{border-bottom:none}
.contact-preview .cp-item .cp-avatar{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;flex-shrink:0;background:var(--surface)}
.contact-preview .cp-item .cp-name{font-weight:700;font-size:14px}
.contact-preview .cp-item .cp-phone{font-size:12px;color:var(--muted);font-family:var(--font-mono)}
.info-card{border:3px solid var(--border);padding:16px;display:flex;align-items:flex-start;gap:12px;font-size:13px;line-height:1.5;background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.info-card .ic-icon{font-size:24px;flex-shrink:0}
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
  <div class="title">🚨 Emergency SOS</div>
</div>
<div class="scroll">
  <div class="sos-hero" id="sosIdle">
    <div class="sos-icon">🚨</div>
    <div class="sos-title">SOS</div>
    <div class="sos-desc">One tap alerts your emergency contacts with your real-time location</div>
  </div>
  <button class="sos-btn" id="sosTriggerBtn" onclick="triggerSOS()">🚨 Activate SOS</button>
  <div class="sos-active" id="sosActive">
    <div class="sa-timer" id="sosCountdown">10</div>
    <div class="sa-text">🚨 SOS Alert Active</div>
    <div class="sa-sub">Your emergency contacts are being notified with your location.</div>
    <button class="sa-cancel" onclick="cancelSOS()">Cancel Alert</button>
  </div>
  <div class="contact-preview">
    <div class="cp-title">👥 Emergency Contacts</div>
    <div class="cp-item"><div class="cp-avatar">JD</div><div><div class="cp-name">Jane Doe</div><div class="cp-phone">+1 (555) 0123</div></div></div>
    <div class="cp-item"><div class="cp-avatar">MR</div><div><div class="cp-name">Mike Roberts</div><div class="cp-phone">+1 (555) 0456</div></div></div>
    <div style="margin-top:8px;text-align:center"><a href="emergency-contacts.html" style="font-size:13px;font-weight:700;color:var(--fg);text-decoration:none;border-bottom:2px solid var(--accent)">Manage Contacts →</a></div>
  </div>
  <div class="info-card">
    <div class="ic-icon">ℹ️</div>
    <div>When activated, Trainly will send your live GPS location to your emergency contacts via SMS and app notification. Location sharing continues for 30 minutes after activation.</div>
  </div>
  <div style="height:8px"></div>
</div>
<script>
function triggerSOS(){
  document.getElementById('sosIdle').style.display='none';
  document.getElementById('sosTriggerBtn').style.display='none';
  const active=document.getElementById('sosActive');
  active.classList.add('show');
  let count=10;
  const timer=document.getElementById('sosCountdown');
  const interval=setInterval(()=>{
    count--;
    timer.textContent=count;
    if(count<=0){
      clearInterval(interval);
      timer.textContent='ALERT';
      document.querySelector('.sa-text').textContent='✅ Emergency contacts notified';
      document.querySelector('.sa-sub').textContent='Your location is being shared. Stay safe.';
    }
  },1000);
  window.sosInterval=interval;
}
function cancelSOS(){
  if(confirm('Cancel SOS alert?')){
    clearInterval(window.sosInterval);
    document.getElementById('sosActive').classList.remove('show');
    document.getElementById('sosIdle').style.display='block';
    document.getElementById('sosTriggerBtn').style.display='block';
    document.querySelector('.sa-text').textContent='🚨 SOS Alert Active';
    document.querySelector('.sa-sub').textContent='Your emergency contacts are being notified with your location.';
  }
}
</script>
</body>
</html>
