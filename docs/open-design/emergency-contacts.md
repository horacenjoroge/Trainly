<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Emergency Contacts</title>
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
.top-bar .add{padding:6px 16px;border:2px solid var(--border);font-weight:800;font-size:12px;cursor:pointer;background:var(--accent);font-family:var(--font-body)}
.scroll{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-top:4px}
.contact-card{border:3px solid var(--border);padding:12px;display:flex;align-items:center;gap:12px;background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.contact-card .cc-avatar{width:44px;height:44px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0;background:var(--accent)}
.contact-card .cc-info{flex:1}
.contact-card .cc-info .cc-name{font-weight:800;font-size:15px}
.contact-card .cc-info .cc-phone{font-size:13px;color:var(--muted);font-family:var(--font-mono)}
.contact-card .cc-info .cc-relationship{font-size:11px;color:var(--muted);font-weight:600}
.contact-card .cc-actions{display:flex;gap:4px}
.contact-card .cc-actions .act{width:32px;height:32px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;background:var(--surface);transition:all .08s}
.contact-card .cc-actions .act:active{background:var(--accent)}
.add-contact{border:3px dashed var(--border);padding:20px;text-align:center;cursor:pointer;font-weight:700;font-size:15px;color:var(--muted);transition:all .08s;display:flex;align-items:center;justify-content:center;gap:8px}
.add-contact:active{background:var(--accent);color:var(--fg)}
.info-card{border:3px solid var(--border);padding:12px;display:flex;align-items:flex-start;gap:12px;font-size:13px;line-height:1.5;background:#FEF2F2;border-color:var(--danger);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--danger)}
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
  <a href="settings.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">Emergency Contacts</div>
  <button class="add" onclick="addContact()">+ Add</button>
</div>
<div class="scroll">
  <div class="info-card">
    <div class="ic-icon">🚨</div>
    <div>When you activate SOS, your emergency contacts receive your live GPS location and a notification.</div>
  </div>
  <div class="section-label">Your Contacts</div>
  <div class="contact-card">
    <div class="cc-avatar">JD</div>
    <div class="cc-info">
      <div class="cc-name">Jane Doe</div>
      <div class="cc-phone">+1 (555) 0123</div>
      <div class="cc-relationship">Spouse</div>
    </div>
    <div class="cc-actions">
      <span class="act" onclick="alert('Message Jane (mock)')">✉</span>
      <span class="act" onclick="if(confirm('Remove Jane?'))this.closest('.contact-card').remove()">✕</span>
    </div>
  </div>
  <div class="contact-card">
    <div class="cc-avatar" style="background:#432DD7;color:#fff">MR</div>
    <div class="cc-info">
      <div class="cc-name">Mike Roberts</div>
      <div class="cc-phone">+1 (555) 0456</div>
      <div class="cc-relationship">Brother</div>
    </div>
    <div class="cc-actions">
      <span class="act" onclick="alert('Message Mike (mock)')">✉</span>
      <span class="act" onclick="if(confirm('Remove Mike?'))this.closest('.contact-card').remove()">✕</span>
    </div>
  </div>
  <div class="add-contact" onclick="addContact()">
    <span style="font-size:24px;font-weight:300">+</span> Add Emergency Contact
  </div>
  <div style="height:8px"></div>
</div>
<script>
function addContact(){
  const name=prompt('Contact name:');
  if(!name)return;
  const phone=prompt('Phone number:');
  if(!phone)return;
  const initials=name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const scroll=document.querySelector('.scroll');
  const addBtn=scroll.querySelector('.add-contact');
  const card=document.createElement('div');
  card.className='contact-card';
  card.innerHTML=`<div class="cc-avatar">${initials}</div><div class="cc-info"><div class="cc-name">${name}</div><div class="cc-phone">${phone}</div><div class="cc-relationship">Contact</div></div><div class="cc-actions"><span class="act" onclick="alert('Message (mock)')">✉</span><span class="act" onclick="if(confirm('Remove?'))this.closest('.contact-card').remove()">✕</span></div>`;
  scroll.insertBefore(card,addBtn);
}
</script>
</body>
</html>
