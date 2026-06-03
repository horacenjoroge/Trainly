<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Onboarding</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
  --success:#16A34A;--danger:#DC2626;
  --font-display:'Inter',system-ui,sans-serif;
  --font-body:'Inter',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  --space-xs:4px;--space-sm:8px;--space-md:12px;--space-lg:16px;--space-xl:24px;--space-2xl:32px;--space-3xl:48px;
  --border-w:3px;
}
html{background:#E5E5E5}
body{font-family:var(--font-body);background:var(--surface);max-width:412px;margin:var(--space-xl) auto;border:4px solid var(--border);min-height:844px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.pf-status{display:flex;align-items:center;justify-content:space-between;padding:var(--space-sm) var(--space-lg);font-size:11px;font-weight:700;font-family:var(--font-mono);background:var(--surface);border-bottom:2px solid var(--border)}
.pf-icons{display:flex;gap:4px;align-items:center}
.pf-icons svg{display:block}
.pf-nav{display:flex;align-items:center;justify-content:space-between;padding:var(--space-sm) var(--space-lg);border-top:3px solid var(--border);background:var(--surface);margin-top:auto;font-size:11px;font-weight:600;color:var(--muted)}
.slide{flex:1;display:flex;flex-direction:column;padding:var(--space-2xl) var(--space-xl);align-items:center;justify-content:center;text-align:center;gap:var(--space-xl)}
.slide .hero-emoji{font-size:72px;line-height:1;margin-bottom:var(--space-sm)}
.slide .hero-emoji.layered{font-size:60px;letter-spacing:-8px}
.slide h1{font-size:35px;font-weight:900;letter-spacing:-0.03em;line-height:1.05}
.slide p{font-size:15px;color:var(--muted);line-height:1.5;max-width:320px}
.dots{display:flex;gap:var(--space-sm);margin:var(--space-md) 0}
.dots span{width:12px;height:12px;border:2px solid var(--border);background:var(--surface)}
.dots span.active{background:var(--accent)}
.btn{display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-body);font-weight:800;border:3px solid var(--border);cursor:pointer;padding:var(--space-md) var(--space-xl);font-size:15px;min-height:48px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .08s;text-decoration:none;color:var(--fg);width:100%;max-width:300px;background:var(--accent)}
.btn:active{transform:translate(0,0);box-shadow:none}
.btn.outline{background:var(--surface)}
.skip{position:absolute;top:var(--space-lg);right:var(--space-lg);font-size:13px;font-weight:700;color:var(--muted);cursor:pointer;z-index:2;border:none;background:none;font-family:var(--font-body)}
.slide-hidden{display:none}
.slide-wrap{flex:1;display:flex;flex-direction:column}
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

<button class="skip" id="skipBtn" onclick="window.location='login.html'">Skip →</button>

<div class="slide-wrap">
  <div class="slide" id="slide1">
    <div class="hero-emoji layered">🏃‍♂️🚴‍♂️🏊‍♂️</div>
    <h1>Track Every Move</h1>
    <p>Running, cycling, swimming, or gym — log every rep, mile, and lap with GPS-powered precision.</p>
    <div class="dots">
      <span class="active"></span>
      <span></span>
      <span></span>
    </div>
    <button class="btn" onclick="nextSlide(2)">Next</button>
  </div>

  <div class="slide slide-hidden" id="slide2">
    <div class="hero-emoji" style="font-size:72px">👥</div>
    <h1>Find Your Crew</h1>
    <p>Share workouts, cheer friends on, and compete on leaderboards. Fitness is better together.</p>
    <div class="dots">
      <span></span>
      <span class="active"></span>
      <span></span>
    </div>
    <button class="btn" onclick="nextSlide(3)">Next</button>
  </div>

  <div class="slide slide-hidden" id="slide3">
    <div class="hero-emoji" style="font-size:72px">🚨</div>
    <h1>Your Safety Net</h1>
    <p>One-tap SOS alerts your emergency contacts with your real-time location. Run fearlessly.</p>
    <div class="dots">
      <span></span>
      <span></span>
      <span class="active"></span>
    </div>
    <button class="btn" onclick="window.location='auth.html#login'">Get Started</button>
  </div>
</div>

<div class="pf-nav">
  <span>Trainly v2.0</span>
  <span>1 of 3</span>
</div>

<script>
let currentSlide = 1;
function nextSlide(n){
  if(n>3)return;
  for(let i=1;i<=3;i++){
    document.getElementById('slide'+i).classList.toggle('slide-hidden',i!==n);
  }
  currentSlide=n;
  document.querySelectorAll('.slide .dots').forEach((d,i)=>{
    const spans=d.querySelectorAll('span');
    spans.forEach((s,j)=>s.classList.toggle('active',j===n-1));
  });
}
</script>
</body>
</html>
