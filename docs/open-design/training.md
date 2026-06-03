<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Training Selection</title>
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
.top-bar{display:flex;align-items:center;padding:var(--space-md) var(--space-lg);border-bottom:3px solid var(--border);gap:var(--space-md)}
.top-bar .back{width:36px;height:36px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;color:var(--fg);transition:all .08s}
.top-bar .back:active{transform:translate(1px,1px)}
.top-bar .title{font-size:17px;font-weight:800}
.scroll{flex:1;overflow-y:auto;padding:var(--space-lg);display:flex;flex-direction:column;gap:var(--space-md)}
.train-card{border:3px solid var(--border);padding:var(--space-xl);cursor:pointer;transition:all .08s;background:var(--surface);transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--border);display:flex;align-items:center;gap:var(--space-lg);text-decoration:none;color:var(--fg)}
.train-card:active{transform:translate(0,0);box-shadow:none}
.train-card .tc-icon{width:56px;height:56px;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;background:var(--surface)}
.train-card .tc-body{flex:1}
.train-card .tc-body .tc-name{font-weight:800;font-size:17px;margin-bottom:2px}
.train-card .tc-body .tc-desc{font-size:13px;color:var(--muted)}
.train-card .tc-arrow{font-size:18px;font-weight:700;color:var(--muted)}
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
  <a href="home.html" class="back">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
  </a>
  <div class="title">Choose Your Training</div>
</div>

<div class="scroll">

  <a href="running.html" class="train-card">
    <div class="tc-icon">🏃</div>
    <div class="tc-body">
      <div class="tc-name">Running Trail</div>
      <div class="tc-desc">High-intensity cardio</div>
    </div>
    <div class="tc-arrow">→</div>
  </a>

  <a href="cycling.html" class="train-card">
    <div class="tc-icon">🚴</div>
    <div class="tc-body">
      <div class="tc-name">Bike Trail</div>
      <div class="tc-desc">Endurance ride</div>
    </div>
    <div class="tc-arrow">→</div>
  </a>

  <a href="swimming.html" class="train-card">
    <div class="tc-icon">🏊</div>
    <div class="tc-body">
      <div class="tc-name">Swimming</div>
      <div class="tc-desc">Full body workout</div>
    </div>
    <div class="tc-arrow">→</div>
  </a>

  <a href="gym.html" class="train-card">
    <div class="tc-icon">🏋️</div>
    <div class="tc-body">
      <div class="tc-name">Gym Session</div>
      <div class="tc-desc">Strength training</div>
    </div>
    <div class="tc-arrow">→</div>
  </a>

  <div style="height:var(--space-md)"></div>
</div>

</body>
</html>
