<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Auth Family Redesign</title>
<style>
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FBFBF9;--surface:#FBFBF9;--fg:#1C293C;--muted:#5A6B7E;
  --border:#1C293C;--accent:#FDC800;--secondary:#432DD7;
  --success:#16A34A;--warning:#D97706;--danger:#DC2626;
  --font-display:'Inter',system-ui,sans-serif;
  --font-body:'Inter',system-ui,sans-serif;
  --font-mono:'JetBrains Mono','SF Mono',monospace;
  --space-xs:4px;--space-sm:8px;--space-md:12px;--space-lg:16px;--space-xl:24px;--space-2xl:32px;
  --radius-sm:2px;--radius:4px;--radius-md:6px;--radius-lg:8px;
  --border-w:3px;--border-w-thick:4px;
  --shadow-offset:4px;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font-body);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
a{color:var(--fg);text-decoration:none}
.layout{display:flex;min-height:100vh}
.sidebar{width:240px;flex-shrink:0;background:var(--surface);border-right:4px solid var(--border);padding:var(--space-xl);position:sticky;top:0;height:100vh;overflow-y:auto}
.sidebar .logo{font-size:21px;font-weight:800;letter-spacing:-0.02em;margin-bottom:var(--space-xl);display:flex;align-items:center;gap:var(--space-sm)}
.sidebar .logo span{display:inline-block;width:24px;height:24px;background:var(--accent);border:3px solid var(--border);transform:rotate(12deg)}
.sidebar nav{display:flex;flex-direction:column;gap:2px}
.sidebar nav a{color:var(--fg);text-decoration:none;padding:var(--space-sm) var(--space-md);font-weight:600;font-size:13px;border:2px solid transparent;transition:all .1s}
.sidebar nav a:hover,.sidebar nav a.active{background:var(--accent);border-color:var(--border);transform:translate(-1px,-1px);box-shadow:2px 2px 0 var(--border)}
.sidebar .nav-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:var(--space-lg) 0 var(--space-sm) var(--space-md)}
.main{flex:1;max-width:100%}
.hero{background:var(--accent);border-bottom:4px solid var(--border);padding:var(--space-2xl) var(--space-xl)}
.hero h1{font-size:clamp(36px,6vw,52px);font-weight:900;letter-spacing:-0.03em;line-height:1.05}
.hero p{font-size:clamp(17px,2.5vw,21px);font-weight:500;margin-top:var(--space-md);max-width:680px;line-height:1.4}
.hero .meta-row{display:flex;gap:var(--space-xl);margin-top:var(--space-xl);font-size:13px;font-weight:600;flex-wrap:wrap}
.hero .meta-row span{display:flex;align-items:center;gap:var(--space-xs)}
.section{padding:var(--space-2xl) var(--space-xl);border-bottom:3px solid var(--border)}
.section:last-child{border-bottom:none}
.section-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:var(--space-xl);flex-wrap:wrap;gap:var(--space-md)}
.section-header h2{font-size:27px;font-weight:800;letter-spacing:-0.02em}
.section-header .file-ref{font-family:var(--font-mono);font-size:12px;color:var(--muted);font-weight:500}
.section-desc{font-size:15px;color:var(--muted);margin-bottom:var(--space-xl);max-width:720px}
.section-sub{font-size:21px;font-weight:800;margin-bottom:var(--space-lg);margin-top:var(--space-xl);letter-spacing:-0.01em}
.section-sub:first-of-type{margin-top:0}
.badge{display:inline-flex;align-items:center;padding:2px var(--space-sm);font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border:2px solid var(--border);line-height:1.2}
.badge.accent{background:var(--accent);color:var(--fg)}
.badge.danger{background:var(--danger);color:#fff}
.badge.success{background:var(--success);color:#fff}
.badge.warning{background:var(--warning);color:#fff}
.badge.outline{background:transparent;color:var(--fg)}
.badge.sm{font-size:10px;padding:1px 6px}
.tag{display:inline-block;background:var(--accent);color:var(--fg);padding:var(--space-xs) var(--space-md);font-weight:700;font-size:13px;border:3px solid var(--border);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);margin-right:var(--space-sm);margin-bottom:var(--space-sm)}
.tag.mono{font-family:var(--font-mono);font-size:12px}
.code-block{background:#1C293C;color:#E5E7EB;padding:var(--space-lg);font-family:var(--font-mono);font-size:13px;line-height:1.6;overflow-x:auto;border:var(--border-w) solid var(--border);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);margin-top:var(--space-lg)}
.code-block .kw{color:#FDC800}
.code-block .str{color:#16A34A}
.code-block .cm{color:#6B7280;font-style:italic}
.code-block .tp{color:#93C5FD}
.code-block .fn{color:#A78BFA}
.code-block .num{color:#FDBA74}
.flow-row{display:flex;align-items:center;gap:var(--space-sm);flex-wrap:wrap;padding:var(--space-sm) 0;font-size:13px;font-weight:600}
.flow-row .step{display:flex;align-items:center;gap:var(--space-xs);padding:var(--space-xs) var(--space-sm);border:2px solid var(--border);background:var(--surface)}
.flow-row .arrow{font-weight:700;color:var(--muted)}
.rule-list{display:flex;flex-direction:column;gap:var(--space-md)}
.rule-item{display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);border:2px solid var(--border);background:var(--surface);font-size:14px}
.rule-item .r-icon{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid var(--border);font-weight:900;font-size:14px;flex-shrink:0;background:var(--accent)}
.state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-lg)}
.state-card{border:2px solid var(--border);padding:var(--space-lg);background:var(--surface);text-align:center}
.state-card .s-icon{font-size:28px;font-weight:900;margin-bottom:var(--space-sm)}
.state-card .s-name{font-weight:800;font-size:14px;margin-bottom:var(--space-xs)}
.state-card .s-desc{font-size:12px;color:var(--muted);line-height:1.4}

/* ── Android Phone Frame ── */
.phone-frame{width:412px;background:var(--surface);border:4px solid var(--border);position:relative;margin:var(--space-lg) 0;overflow:hidden;flex-shrink:0}
.phone-frame .pf-status{display:flex;align-items:center;justify-content:space-between;padding:var(--space-sm) var(--space-lg);font-size:11px;font-weight:700;font-family:var(--font-mono);background:var(--surface);border-bottom:2px solid var(--border)}
.phone-frame .pf-status .pf-time{font-weight:700}
.phone-frame .pf-status .pf-icons{display:flex;gap:var(--space-xs);align-items:center}
.phone-frame .pf-status .pf-icons svg{display:block}
.phone-frame .pf-body{min-height:600px;display:flex;flex-direction:column;gap:0}
.phone-frame .pf-body.splash-bg{background:var(--surface);align-items:center;justify-content:center}
.phone-frame .pf-body.splash-bg.auth-loading{background:#1C293C}
.phone-frame .pf-nav{display:flex;align-items:center;justify-content:space-between;padding:var(--space-sm) var(--space-lg);border-top:3px solid var(--border);background:var(--surface);margin-top:auto;font-size:11px;font-weight:600;color:var(--muted)}

/* ── Splash Screen ── */
.splash-content{display:flex;flex-direction:column;align-items:center;gap:var(--space-xl);padding:var(--space-2xl)}
.splash-logo{width:80px;height:80px;background:var(--accent);border:4px solid var(--border);transform:rotate(12deg);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:var(--fg);margin-bottom:var(--space-sm);animation:splashPulse 1.5s ease-in-out infinite}
@keyframes splashPulse{0%,100%{transform:rotate(12deg) scale(1)}50%{transform:rotate(12deg) scale(1.05)}}
.splash-content h1{font-size:35px;font-weight:900;letter-spacing:-0.03em;text-align:center}
.splash-content p{font-size:15px;color:var(--muted);text-align:center}
.splash-loading{display:flex;flex-direction:column;align-items:center;gap:var(--space-md)}
.splash-loading .bar{width:120px;height:4px;background:var(--border);overflow:hidden}
.splash-loading .bar span{display:block;height:100%;width:40%;background:var(--accent);animation:barMove 1s ease-in-out infinite}
@keyframes barMove{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}
.splash-offline{display:flex;flex-direction:column;align-items:center;gap:var(--space-md);padding:var(--space-xl);border:3px solid var(--warning);background:var(--surface);text-align:center}
.splash-offline .off-icon{width:48px;height:48px;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;background:var(--warning);color:#fff}

/* ── Login Screen ── */
.login-content{padding:var(--space-xl);display:flex;flex-direction:column;gap:var(--space-lg)}
.login-content .login-logo{display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm)}
.login-content .login-logo .l-square{width:32px;height:32px;background:var(--accent);border:3px solid var(--border);transform:rotate(12deg)}
.login-content .login-logo .l-name{font-size:21px;font-weight:900;letter-spacing:-0.02em}
.login-content h2{font-size:27px;font-weight:900;letter-spacing:-0.02em}
.login-content .login-sub{font-size:13px;color:var(--muted);font-weight:500}
.tn-input-wrap{display:flex;flex-direction:column;gap:var(--space-sm)}
.tn-input-wrap .label{font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.03em}
.tn-input{font-family:var(--font-body);font-size:15px;padding:var(--space-md) var(--space-lg);border:3px solid var(--border);background:var(--surface);color:var(--fg);outline:none;width:100%;min-height:48px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .1s}
.tn-input:focus{background:var(--accent);border-color:var(--border);transform:translate(0,0);box-shadow:0 0 0 var(--border)}
.tn-input.error{border-color:var(--danger)}
.tn-input.error:focus{background:#FEF2F2}
.tn-input-wrap .hint{font-size:12px;color:var(--muted)}
.tn-input-wrap .error-text{font-size:12px;color:var(--danger);font-weight:600}
.tn-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-sm);font-family:var(--font-body);font-weight:800;border:3px solid var(--border);cursor:pointer;transition:all .1s;text-decoration:none;white-space:nowrap;font-size:15px;padding:var(--space-md) var(--space-xl);min-height:48px;min-width:48px;transform:translate(-3px,-3px);box-shadow:6px 6px 0 var(--border);-webkit-tap-highlight-color:transparent;width:100%}
.tn-btn:active{transform:translate(0,0);box-shadow:0 0 0 var(--border)}
.tn-btn.primary{background:var(--accent);color:var(--fg)}
.tn-btn.primary.large{font-size:17px;padding:var(--space-lg) var(--space-2xl);min-height:56px}
.tn-btn.outline{background:var(--surface);color:var(--fg)}
.tn-btn.loading{position:relative;color:transparent}
.tn-btn.loading::after{content:'';position:absolute;width:20px;height:20px;border:3px solid var(--border);border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.login-divider{display:flex;align-items:center;gap:var(--space-md);margin:var(--space-sm) 0}
.login-divider::before,.login-divider::after{content:'';flex:1;height:2px;background:var(--border)}
.login-divider span{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.social-row{display:flex;gap:var(--space-md)}
.social-btn{flex:1;height:48px;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;cursor:pointer;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .1s;background:var(--surface)}
.social-btn:active{transform:translate(0,0);box-shadow:none}
.auth-link{font-size:13px;font-weight:600;text-align:center;color:var(--muted);padding:var(--space-sm) 0}
.auth-link a{color:var(--fg);font-weight:800;border-bottom:2px solid var(--accent)}
.offline-banner{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) var(--space-lg);background:var(--warning);color:#fff;font-size:12px;font-weight:700;border-bottom:3px solid var(--border)}
.login-error-card{border:3px solid var(--danger);padding:var(--space-md);background:#FEF2F2;display:flex;align-items:center;gap:var(--space-md);font-size:13px;font-weight:600}
.login-error-card .e-icon{width:32px;height:32px;border:2px solid var(--danger);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;color:var(--danger);flex-shrink:0;background:var(--surface)}

/* ── Register Screen ── */
.register-content{padding:var(--space-xl);display:flex;flex-direction:column;gap:var(--space-lg)}
.step-indicator{display:flex;gap:var(--space-sm);align-items:center}
.step-dot{width:36px;height:36px;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;background:var(--surface);transform:translate(-1px,-1px);box-shadow:2px 2px 0 var(--border);transition:all .1s}
.step-dot.active{background:var(--accent)}
.step-dot.completed{background:var(--success);color:#fff}
.step-connector{width:24px;height:3px;background:var(--border)}
.reg-header h2{font-size:27px;font-weight:900;letter-spacing:-0.02em}
.reg-header p{font-size:13px;color:var(--muted);margin-top:var(--space-xs)}
.reg-step-hidden{display:none}
.reg-step-visible{display:flex;flex-direction:column;gap:var(--space-lg)}
.chip-row{display:flex;flex-wrap:wrap;gap:var(--space-sm)}
.tn-chip{display:inline-flex;align-items:center;gap:var(--space-xs);padding:var(--space-xs) var(--space-md);border:3px solid var(--border);font-family:var(--font-body);font-size:13px;font-weight:700;background:var(--surface);cursor:pointer;transition:all .1s;transform:translate(-1px,-1px);box-shadow:2px 2px 0 var(--border)}
.tn-chip:active{transform:translate(0,0);box-shadow:none}
.tn-chip.selected{background:var(--accent)}

/* ── Frame grid ── */
.frame-row{display:flex;flex-wrap:wrap;gap:var(--space-2xl);align-items:flex-start}
.frame-col{display:flex;flex-direction:column;gap:var(--space-sm)}
.frame-col .frame-label{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);display:flex;align-items:center;gap:var(--space-sm)}
.frame-col .frame-label .states-badge{font-size:10px;font-weight:700;padding:1px 6px;border:2px solid var(--border);background:var(--surface);text-transform:none;letter-spacing:0}
.frame-toggle{display:flex;gap:var(--space-xs);margin-bottom:var(--space-md);flex-wrap:wrap}
.frame-toggle button{padding:var(--space-xs) var(--space-md);border:2px solid var(--border);font-size:11px;font-weight:700;cursor:pointer;background:var(--surface);transition:all .1s;font-family:var(--font-body)}
.frame-toggle button.active{background:var(--accent)}
.frame-toggle button:hover:not(.active){background:#f0f0f0}

/* ── Responsive ── */
/* ── Neo-Brutalist Icon System ── */
.tn-icon-row{display:flex;flex-wrap:wrap;gap:var(--space-lg);align-items:center}
.tn-icon{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border:3px solid var(--border);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .1s;color:var(--fg)}
.tn-icon:active{transform:translate(0,0);box-shadow:none}
.tn-icon.accent{background:var(--accent)}
.tn-icon.dark{background:var(--fg);color:var(--surface)}
.tn-icon.sm{width:36px;height:36px}
.tn-icon.lg{width:56px;height:56px}
.icon-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:var(--space-lg)}
.icon-grid .ic-item{display:flex;flex-direction:column;align-items:center;gap:var(--space-xs);padding:var(--space-sm);border:2px solid var(--border);background:var(--surface);text-align:center}
.icon-grid .ic-item svg{display:block;color:var(--fg)}
.icon-grid .ic-item .ic-name{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.icon-grid .ic-item:hover{background:var(--accent)}
.icon-grid .ic-item .ic-kt{font-family:var(--font-mono);font-size:9px;color:var(--muted);display:none}
.icon-grid .ic-item:hover .ic-kt{display:block}

/* ── Input with icon prefix ── */
.tn-input-group{display:flex;align-items:stretch;border:3px solid var(--border);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .1s;background:var(--surface);overflow:hidden}
.tn-input-group:focus-within{background:var(--accent);transform:translate(0,0);box-shadow:none}
.tn-input-group.error{border-color:var(--danger)}
.tn-input-group.error:focus-within{background:#FEF2F2}
.tn-input-group .tn-input-prefix{display:flex;align-items:center;justify-content:center;width:48px;flex-shrink:0;border-right:3px solid var(--border);background:var(--surface);color:var(--muted);transition:all .1s}
.tn-input-group .tn-input-prefix svg{display:block}
.tn-input-group:focus-within .tn-input-prefix{background:var(--accent);color:var(--fg)}
.tn-input-group .tn-input{flex:1;border:none;box-shadow:none;transform:none;min-width:0}
.tn-input-group .tn-input:focus{background:transparent;border:none;box-shadow:none;transform:none}
.tn-input-group .tn-input-suffix{display:flex;align-items:center;justify-content:center;width:48px;flex-shrink:0;border-left:3px solid var(--border);background:var(--surface);cursor:pointer;transition:all .1s;color:var(--muted);-webkit-tap-highlight-color:transparent}
.tn-input-group .tn-input-suffix:hover{background:var(--border);color:var(--surface)}
.tn-input-group .tn-input-suffix.active{color:var(--fg)}

/* ── Icon Showcase ── */
.icon-showcase{display:flex;flex-direction:column;gap:var(--space-xl)}
.icon-showcase .isc-header{display:flex;align-items:center;justify-content:space-between}
.icon-showcase .isc-header h3{font-size:21px;font-weight:800}
.icon-showcase .isc-header .isc-count{font-size:12px;font-weight:700;color:var(--muted);font-family:var(--font-mono)}
.size-row{display:flex;align-items:flex-end;gap:var(--space-xl);flex-wrap:wrap}
.size-row .size-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-top:var(--space-sm);text-align:center}

@media(max-width:900px){
  .sidebar{display:none}
  .frame-row{flex-direction:column;align-items:center}
  .phone-frame{width:360px}
  .section{padding:var(--space-xl) var(--space-lg)}
  .hero{padding:var(--space-xl) var(--space-lg)}
  .icon-grid{grid-template-columns:repeat(auto-fill,minmax(52px,1fr))}
}
</style>
</head>
<body>
<div class="layout">
<aside class="sidebar">
  <div class="logo"><span></span> Trainly</div>
  <div class="nav-label">Auth Family</div>
  <nav>
    <a href="#overview">Overview</a>
    <a href="#splash">Splash Screen</a>
    <a href="#login">Login Screen</a>
    <a href="#register">Register Screen</a>
    <a href="#flow">Navigation Flow</a>
    <a href="#states">State Matrix</a>
    <a href="#code">AuthGraph.kt</a>
  </nav>
</aside>

<div class="main">
<section class="hero">
  <h1>Auth Family<br>Neo-Brutalist Redesign</h1>
  <p>Three screens redesigned as a cohesive family: Splash, Login, and Register. Every screen implements all five states (loading, loaded, error, empty, offline) through the TrainlyScaffold + ScreenUiState pattern.</p>
  <div class="meta-row">
    <span>→ 3 screens</span>
    <span>→ 5 states each</span>
    <span>→ authGraph (nested)</span>
    <span>→ TrainlyInput × TrainlyButton</span>
    <span>→ 2-step or 3-step register flow</span>
  </div>
</section>

<!-- ═══ OVERVIEW ═══ -->
<section class="section" id="overview">
<div class="section-header">
  <h2>Family Overview</h2>
  <span class="file-ref">screens/auth/</span>
</div>
<div class="section-desc">
  The auth family owns three screens inside <span class="tag mono" style="font-size:11px;padding:2px 6px">authGraph</span>. All three share the same spacing, typography, border, and button system. No screen reinvents layout — each composes from the same TrainlyInput, TrainlyButton, and TrainlyCard primitives.
</div>
<div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;margin-bottom:var(--space-lg)">
  <div style="flex:1;min-width:200px;border:3px solid var(--border);padding:var(--space-lg);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)">
    <div style="font-weight:800;font-size:17px;margin-bottom:var(--space-sm)">Splash</div>
    <div style="font-size:14px;color:var(--muted);line-height:1.6;display:flex;flex-direction:column;gap:var(--space-xs)">
      <span>→ Brand splash with animated logo</span>
      <span>→ Auto-navigate to login or home</span>
      <span>→ 1.5s splash duration</span>
      <span>→ Offline detection banner</span>
    </div>
  </div>
  <div style="flex:1;min-width:200px;border:3px solid var(--border);padding:var(--space-lg);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)">
    <div style="font-weight:800;font-size:17px;margin-bottom:var(--space-sm)">Login</div>
    <div style="font-size:14px;color:var(--muted);line-height:1.6;display:flex;flex-direction:column;gap:var(--space-xs)">
      <span>→ Email + password form</span>
      <span>→ Social login row (Google, Apple)</span>
      <span>→ Forgot password link</span>
      <span>→ States: idle, loading, error, offline</span>
    </div>
  </div>
  <div style="flex:1;min-width:200px;border:3px solid var(--border);padding:var(--space-lg);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)">
    <div style="font-weight:800;font-size:17px;margin-bottom:var(--space-sm)">Register</div>
    <div style="font-size:14px;color:var(--muted);line-height:1.6;display:flex;flex-direction:column;gap:var(--space-xs)">
      <span>→ Multi-step: Account → Profile → Goals</span>
      <span>→ Step dots with active/completed states</span>
      <span>→ Chip-based sport/level picker</span>
      <span>→ States: idle, validating, submitting, error</span>
    </div>
  </div>
</div>
</section>

<!-- ═══ SPLASH SCREEN ═══ -->
<section class="section" id="splash">
<div class="section-header">
  <h2>Splash Screen</h2>
  <span class="file-ref">SplashScreen.kt</span>
</div>
<div class="section-desc">
  Minimal brand splash. Yellow rotated logo block + app name + tagline. Auto-routes to login or home after 1.5s based on stored auth state. Dark background variant for loading state reduces visual jump when transitioning to the app.
</div>

<div class="frame-row">
  <!-- Default state -->
  <div class="frame-col">
    <div class="frame-label">Default · Auth Check</div>
    <div class="phone-frame">
      <div class="pf-status">
        <span class="pf-time">9:41</span>
        <span class="pf-icons">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 9l4 4-4 4"/><path d="M9 21h14"/><path d="M9 13h14"/><path d="M9 5h14"/></svg>
          <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="3" height="10" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><rect x="14" y="1" width="3" height="22" rx="1"/><rect x="20" y="4" width="3" height="16" rx="1"/></svg>
        </span>
      </div>
      <div class="pf-body splash-bg" style="min-height:700px">
        <div class="splash-content">
          <div class="splash-logo">T</div>
          <h1>Trainly</h1>
          <p>Your training, untamed.<br>GPS routes, analytics, and community.</p>
          <div class="splash-loading">
            <div class="bar"><span></span></div>
            <span style="font-size:12px;color:var(--muted);font-weight:600">Checking account...</span>
          </div>
        </div>
      </div>
      <div class="pf-nav">
        <span>Trainly v2.0</span>
      </div>
    </div>
  </div>

  <!-- Loading / Dark state -->
  <div class="frame-col">
    <div class="frame-label">Loading · Dark Variant</div>
    <div class="phone-frame" style="border-color:#1C293C">
      <div class="pf-status" style="background:#1C293C;color:#E5E7EB;border-color:#333">
        <span class="pf-time" style="color:#fff">9:41</span>
        <span class="pf-icons" style="color:#fff">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M1 9l4 4-4 4"/><path d="M9 21h14"/><path d="M9 13h14"/><path d="M9 5h14"/></svg>
          <svg width="16" height="14" viewBox="0 0 24 24" fill="#fff"><rect x="2" y="7" width="3" height="10" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><rect x="14" y="1" width="3" height="22" rx="1"/><rect x="20" y="4" width="3" height="16" rx="1"/></svg>
        </span>
      </div>
      <div class="pf-body splash-bg auth-loading" style="min-height:700px">
        <div class="splash-content">
          <div class="splash-logo" style="border-color:#fff;color:#fff;animation:splashPulse 1s ease-in-out infinite">T</div>
          <h1 style="color:#fff">Trainly</h1>
          <p style="color:#9CA3AF">Loading your profile...</p>
          <div class="splash-loading">
            <div class="bar" style="background:#333"><span></span></div>
          </div>
        </div>
      </div>
      <div class="pf-nav" style="background:#1C293C;color:#6B7280;border-color:#333;font-size:11px;font-weight:600">
        <span>Trainly v2.0</span>
      </div>
    </div>
  </div>

  <!-- Offline state -->
  <div class="frame-col">
    <div class="frame-label">Offline State</div>
    <div class="phone-frame">
      <div class="pf-status">
        <span class="pf-time">9:41</span>
        <span class="pf-icons">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 9l4 4-4 4"/><path d="M9 21h14"/><path d="M9 13h14"/><path d="M9 5h14"/></svg>
          <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="3" height="10" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><rect x="14" y="1" width="3" height="22" rx="1"/><rect x="20" y="4" width="3" height="16" rx="1"/></svg>
        </span>
      </div>
      <div class="pf-body splash-bg" style="min-height:700px">
        <div class="splash-content" style="gap:var(--space-xl)">
          <div class="splash-logo" style="animation:none">T</div>
          <h1>Trainly</h1>
          <div class="splash-offline">
            <div class="off-icon">!</div>
            <div style="font-weight:800;font-size:17px">No Connection</div>
            <div style="font-size:13px;color:var(--muted);line-height:1.4">Some features may be limited. Your saved workouts will sync when you're back online.</div>
            <button style="margin-top:var(--space-sm);font-family:var(--font-body);padding:var(--space-sm) var(--space-lg);border:3px solid var(--border);font-weight:800;font-size:13px;background:var(--surface);cursor:pointer;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .1s">Retry Connection</button>
          </div>
        </div>
      </div>
      <div class="pf-nav">
        <span>Trainly v2.0</span>
      </div>
    </div>
  </div>
</div>

<div class="code-block">
<span class="cm">// SplashScreen.kt — Stateless, hoists auth-check to ViewModel</span>
<span class="tp">TrainlyScaffold</span>(
    topBar = <span class="kw">null</span>,  <span class="cm">// No top bar on splash</span>
    bottomBar = <span class="kw">null</span>  <span class="cm">// No bottom nav on splash</span>
) {
    <span class="kw">when</span> (uiState) {
        <span class="kw">is</span> SplashUiState.Loading -> {
            SplashLogo(modifier = Modifier)
            TrainlyLoading(text = <span class="str">"Checking account..."</span>)
        }
        <span class="kw">is</span> SplashUiState.Offline -> {
            SplashLogo(modifier = Modifier)
            TrainlyEmptyState(
                title = <span class="str">"No Connection"</span>,
                message = <span class="str">"Your saved workouts will sync when you're back online."</span>,
                action = { TrainlyButton(onClick = onRetry) { Text(<span class="str">"Retry Connection"</span>) } }
            )
        }
        <span class="kw">is</span> SplashUiState.Authenticated -> LaunchedEffect(Unit) {
            delay(<span class="num">1500</span>); navController.navigate(<span class="str">"home_graph"</span>) { popUpTo(<span class="num">0</span>) }
        }
        <span class="kw">is</span> SplashUiState.Unauthenticated -> LaunchedEffect(Unit) {
            delay(<span class="num">1500</span>); navController.navigate(<span class="str">"auth/login"</span>) { popUpTo(<span class="num">0</span>) }
        }
    }
}
</div>
</section>

<!-- ═══ LOGIN SCREEN ═══ -->
<section class="section" id="login">
<div class="section-header">
  <h2>Login Screen</h2>
  <span class="file-ref">LoginScreen.kt</span>
</div>
<div class="section-desc">
  Email + password form with chunky neo-brutalist inputs. Primary CTA fills full width. Social login row for Google and Apple. Every state (idle, loading, error, offline) is visually distinct and composed from design system primitives.
</div>

<div class="frame-toggle" id="loginToggle">
  <button class="active" data-state="idle">Idle</button>
  <button data-state="loading">Loading</button>
  <button data-state="error">Error</button>
  <button data-state="offline">Offline</button>
</div>

<div class="frame-row">
  <div class="frame-col">
    <div class="phone-frame">
      <div class="pf-status">
        <span class="pf-time">9:41</span>
        <span class="pf-icons">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 9l4 4-4 4"/><path d="M9 21h14"/><path d="M9 13h14"/><path d="M9 5h14"/></svg>
          <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="3" height="10" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><rect x="14" y="1" width="3" height="22" rx="1"/><rect x="20" y="4" width="3" height="16" rx="1"/></svg>
        </span>
      </div>
      <div class="pf-body" style="min-height:700px">
        <div class="login-content" id="loginBody">
          <div class="login-logo">
            <div class="l-square"></div>
            <div class="l-name">Trainly</div>
          </div>
          <div>
            <h2>Welcome back</h2>
            <div class="login-sub">Log in to continue your training.</div>
          </div>

          <div id="loginOfflineBanner" style="display:none" class="offline-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            You're offline. Login requires an internet connection.
          </div>

          <div id="loginErrorCard" style="display:none" class="login-error-card">
            <div class="e-icon">!</div>
            <span id="loginErrorText">Invalid email or password. Please try again.</span>
          </div>

          <div class="tn-input-wrap">
            <span class="label">Email</span>
            <div class="tn-input-group" id="loginEmailGroup">
              <span class="tn-input-prefix">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
              </span>
              <input class="tn-input" id="loginEmail" type="email" placeholder="you@example.com" value="alex@trainly.app">
            </div>
          </div>
          <div class="tn-input-wrap">
            <span class="label">Password</span>
            <div class="tn-input-group" id="loginPasswordGroup">
              <span class="tn-input-prefix">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
              </span>
              <input class="tn-input" id="loginPassword" type="password" placeholder="Enter password" value="········">
              <span class="tn-input-suffix" id="loginEyeBtn" onclick="togglePasswordVisibility('loginPassword', 'loginEyeIcon', this)">
                <svg id="loginEyeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </span>
            </div>
          </div>

          <div style="text-align:right;margin-top:-8px">
            <span style="font-size:12px;font-weight:700;color:var(--muted);border-bottom:2px solid var(--border);cursor:pointer">Forgot password?</span>
          </div>

          <button class="tn-btn primary large" id="loginBtn" onclick="this.classList.toggle('loading')">
            <span id="loginBtnText">Log In</span>
          </button>

          <div class="login-divider"><span>or continue with</span></div>

          <div class="social-row">
            <div class="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </div>
            <div class="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </div>
          </div>

          <div class="auth-link">Don't have an account? <a href="#">Create one</a></div>
        </div>
      </div>
      <div class="pf-nav">
        <span>Trainly v2.0</span>
      </div>
    </div>
  </div>

  <div style="flex:1;min-width:280px">
    <div class="code-block" style="margin-top:0">
<span class="cm">// LoginScreen.kt — Stateless, ViewModel hoists state</span>
<span class="tp">LoginScreen</span>(
    uiState: LoginUiState,
    onEmailChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onLoginClick: () -> Unit,
    onGoogleLogin: () -> Unit,
    onAppleLogin: () -> Unit,
    onForgotPassword: () -> Unit,
    onRegisterClick: () -> Unit
) {
    <span class="tp">TrainlyScaffold</span>(topBar = <span class="kw">null</span>, bottomBar = <span class="kw">null</span>) {
        <span class="kw">when</span> (uiState) {
            <span class="kw">is</span> LoginUiState.Idle -> LoginForm(...)
            <span class="kw">is</span> LoginUiState.Loading -> LoginForm(enabled = <span class="kw">false</span>, showSpinner = <span class="kw">true</span>)
            <span class="kw">is</span> LoginUiState.Error -> LoginForm(error = uiState.message)
            <span class="kw">is</span> LoginUiState.Offline -> Column {
                OfflineBanner()
                LoginForm(enabled = <span class="kw">false</span>)
            }
        }
    }
}

<span class="cm">// LoginUiState.kt</span>
sealed <span class="kw">class</span> LoginUiState {
    <span class="kw">data object</span> Idle : LoginUiState()
    <span class="kw">data object</span> Loading : LoginUiState()
    <span class="kw">data class</span> Error(<span class="kw">val</span> message: String) : LoginUiState()
    <span class="kw">data object</span> Offline : LoginUiState()
}
    </div>
  </div>
</div>
</section>

<!-- ═══ REGISTER SCREEN ═══ -->
<section class="section" id="register">
<div class="section-header">
  <h2>Register Screen</h2>
  <span class="file-ref">RegisterScreen.kt</span>
</div>
<div class="section-desc">
  Multi-step registration with a 3-step flow. Step indicator uses chunky dots with connector bars. Each step validates before advancing. Chip-based selection for sport preferences and experience level.
</div>

<div class="frame-toggle" id="registerToggle">
  <button class="active" data-step="1">Step 1 · Account</button>
  <button data-step="2">Step 2 · Profile</button>
  <button data-step="3">Step 3 · Goals</button>
</div>

<div class="frame-row">
  <div class="frame-col">
    <div class="phone-frame">
      <div class="pf-status">
        <span class="pf-time">9:41</span>
        <span class="pf-icons">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 9l4 4-4 4"/><path d="M9 21h14"/><path d="M9 13h14"/><path d="M9 5h14"/></svg>
          <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="3" height="10" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><rect x="14" y="1" width="3" height="22" rx="1"/><rect x="20" y="4" width="3" height="16" rx="1"/></svg>
        </span>
      </div>
      <div class="pf-body" style="min-height:700px">
        <div class="register-content">

          <div class="step-indicator">
            <div class="step-dot completed">1</div>
            <div class="step-connector" id="conn1"></div>
            <div class="step-dot active" id="dot2">2</div>
            <div class="step-connector" id="conn2"></div>
            <div class="step-dot" id="dot3">3</div>
          </div>

          <!-- Step 1: Account -->
          <div id="regStep1" class="reg-step-visible">
            <div class="reg-header">
              <h2>Create account</h2>
              <p>Set up your login credentials.</p>
            </div>
            <div class="tn-input-wrap">
              <span class="label">Full Name</span>
              <div class="tn-input-group">
                <span class="tn-input-prefix">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>
                </span>
                <input class="tn-input" type="text" placeholder="Alex Johnson" value="Alex Johnson">
              </div>
            </div>
            <div class="tn-input-wrap">
              <span class="label">Email</span>
              <div class="tn-input-group">
                <span class="tn-input-prefix">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                </span>
                <input class="tn-input" type="email" placeholder="you@example.com" value="alex@trainly.app">
              </div>
            </div>
            <div class="tn-input-wrap">
              <span class="label">Password</span>
              <div class="tn-input-group">
                <span class="tn-input-prefix">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                </span>
                <input class="tn-input" id="regPassword" type="password" placeholder="At least 8 characters">
                <span class="tn-input-suffix" onclick="togglePasswordVisibility('regPassword', 'regEyeIcon', this)">
                  <svg id="regEyeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </span>
              </div>
              <span class="hint">At least 8 characters</span>
            </div>
            <button class="tn-btn primary large">Create Account →</button>
            <div class="auth-link">Already have an account? <a href="#">Log in</a></div>
          </div>

          <!-- Step 2: Profile -->
          <div id="regStep2" class="reg-step-hidden">
            <div class="reg-header">
              <h2>Your profile</h2>
              <p>Tell us about your fitness background.</p>
            </div>
            <div class="tn-input-wrap">
              <span class="label">Your Sports</span>
            </div>
            <div class="chip-row">
              <div class="tn-chip selected">Running</div>
              <div class="tn-chip">Cycling</div>
              <div class="tn-chip">Swimming</div>
              <div class="tn-chip selected">Strength</div>
              <div class="tn-chip">Yoga</div>
              <div class="tn-chip">Hiking</div>
            </div>
            <div class="tn-input-wrap" style="margin-top:var(--space-sm)">
              <span class="label">Experience Level</span>
            </div>
            <div class="chip-row">
              <div class="tn-chip">Beginner</div>
              <div class="tn-chip selected">Intermediate</div>
              <div class="tn-chip">Advanced</div>
              <div class="tn-chip">Athlete</div>
            </div>
            <div class="tn-input-wrap" style="margin-top:var(--space-sm)">
              <span class="label">Location</span>
              <input class="tn-input" type="text" placeholder="City, Country" value="Portland, OR">
            </div>
            <button class="tn-btn primary large">Continue →</button>
          </div>

          <!-- Step 3: Goals -->
          <div id="regStep3" class="reg-step-hidden">
            <div class="reg-header">
              <h2>Your goals</h2>
              <p>What do you want to achieve?</p>
            </div>
            <div class="tn-input-wrap">
              <span class="label">Primary Goal</span>
            </div>
            <div class="chip-row">
              <div class="tn-chip selected">Improve Fitness</div>
              <div class="tn-chip">Lose Weight</div>
              <div class="tn-chip selected">Build Strength</div>
              <div class="tn-chip">Race Training</div>
              <div class="tn-chip">General Health</div>
            </div>
            <div class="tn-input-wrap" style="margin-top:var(--space-sm)">
              <span class="label">Weekly Workouts Target</span>
              <select class="tn-input" style="appearance:none;cursor:pointer">
                <option>2-3 per week</option>
                <option selected>4-5 per week</option>
                <option>6-7 per week</option>
              </select>
            </div>
            <div class="tn-input-wrap">
              <span class="label">Height (cm)</span>
              <input class="tn-input" type="number" placeholder="175">
            </div>
            <div class="tn-input-wrap">
              <span class="label">Weight (kg)</span>
              <input class="tn-input" type="number" placeholder="70">
            </div>
            <button class="tn-btn primary large">Start Training →</button>
          </div>

        </div>
      </div>
      <div class="pf-nav">
        <span>Step 1 of 3</span>
        <span>Register</span>
      </div>
    </div>
  </div>

  <div style="flex:1;min-width:280px">
    <div class="code-block" style="margin-top:0">
<span class="cm">// RegisterScreen.kt — State hoisted to RegisterViewModel</span>
<span class="tp">RegisterScreen</span>(
    uiState: RegisterUiState,
    onStepAdvance: () -> Unit,
    onStepBack: () -> Unit,
    onSportToggle: (String) -> Unit,
    onLevelSelect: (ExperienceLevel) -> Unit,
    onSubmit: () -> Unit
) {
    <span class="tp">TrainlyScaffold</span>(
        topBar = TrainlyTopBar(
            title = <span class="str">"Create Account"</span>,
            onBack = onStepBack
        ),
        bottomBar = <span class="kw">null</span>
    ) { padding <span class="cm">-></span>
        <span class="tp">StepIndicator</span>(currentStep = uiState.currentStep, totalSteps = <span class="num">3</span>)
        <span class="kw">when</span> (uiState.currentStep) {
            <span class="num">1</span> -> AccountStep(uiState.account, onStepAdvance)
            <span class="num">2</span> -> ProfileStep(uiState.profile, onSportToggle, onLevelSelect, onStepAdvance)
            <span class="num">3</span> -> GoalsStep(uiState.goals, onSubmit)
        }
    }
}

<span class="cm">// RegisterUiState.kt</span>
<span class="kw">data class</span> RegisterUiState(
    <span class="kw">val</span> currentStep: Int = <span class="num">1</span>,
    <span class="kw">val</span> account: AccountStepState = AccountStepState(),
    <span class="kw">val</span> profile: ProfileStepState = ProfileStepState(),
    <span class="kw">val</span> goals: GoalsStepState = GoalsStepState(),
    <span class="kw">val</span> isSubmitting: Boolean = <span class="kw">false</span>,
    <span class="kw">val</span> error: String? = <span class="kw">null</span>
)
    </div>
  </div>
</div>

<div class="section-sub" style="margin-top:var(--space-xl)">Register States</div>
<div class="state-grid">
  <div class="state-card"><div class="s-icon">○</div><div class="s-name">Idle</div><div class="s-desc">Form ready, no input yet</div></div>
  <div class="state-card"><div class="s-icon">◉</div><div class="s-name">Validating</div><div class="s-desc">Field validation on advance</div></div>
  <div class="state-card"><div class="s-icon">⬇</div><div class="s-name">Submitting</div><div class="s-desc">Button shows spinner, inputs disabled</div></div>
  <div class="state-card" style="border-color:var(--danger)"><div class="s-icon" style="color:var(--danger)">!</div><div class="s-name">Error</div><div class="s-desc">Inline error per step, error banner</div></div>
  <div class="state-card" style="border-color:var(--warning)"><div class="s-icon" style="color:var(--warning)">◌</div><div class="s-name">Offline</div><div class="s-desc">Banner: registration requires connection</div></div>
</div>
</section>

<!-- ═══ ICON SYSTEM ═══ -->
<section class="section" id="icons">
<div class="section-header">
  <h2>Neo-Brutalist Icon System</h2>
  <span class="file-ref">TrainlyIcons.kt</span>
</div>
<div class="section-desc">
  Chunky, thick-stroke SVG icons matching the neo-brutalist aesthetic. 3px stroke, square caps, sharp joins, 24×24 viewBox. Every icon is designed to work at 24dp with the app's border/shadow system. Rendered below as <span class="tag mono" style="font-size:11px;padding:2px 6px">ImageVector</span> composables in Kotlin.
</div>

<div class="icon-showcase">
  <div class="isc-header">
    <h3>Full Icon Set</h3>
    <span class="isc-count">24 icons · 3px stroke</span>
  </div>

  <div class="comp-group">
    <h3>Auth &amp; Navigation Icons</h3>
    <div class="icon-grid">

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>
<span class="ic-name">User</span>
<span class="ic-kt">Icons.User</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
<span class="ic-name">Mail</span>
<span class="ic-kt">Icons.Mail</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
<span class="ic-name">Lock</span>
<span class="ic-kt">Icons.Lock</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
<span class="ic-name">Eye</span>
<span class="ic-kt">Icons.Eye</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.06 3.06M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>
<span class="ic-name">Eye Off</span>
<span class="ic-kt">Icons.EyeOff</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
<span class="ic-name">Person</span>
<span class="ic-kt">Icons.Person</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
<span class="ic-name">Expand</span>
<span class="ic-kt">Icons.Expand</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M10 3H3v7"/><path d="M14 21h7v-7"/><path d="M3 21l7-7"/><path d="M21 3l-7 7"/></svg>
<span class="ic-name">Collapse</span>
<span class="ic-kt">Icons.Collapse</span>
</div>

    </div>
  </div>

  <div class="comp-group">
    <h3>App Navigation</h3>
    <div class="icon-grid">

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M3 10l9-7 9 7"/><path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"/></svg>
<span class="ic-name">Home</span>
<span class="ic-kt">Icons.Home</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M10 9h5"/><path d="M10 13h5"/><path d="M10 17h3"/></svg>
<span class="ic-name">Activity</span>
<span class="ic-kt">Icons.Activity</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
<span class="ic-name">Community</span>
<span class="ic-kt">Icons.Community</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
<span class="ic-name">Analytics</span>
<span class="ic-kt">Icons.Analytics</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
<span class="ic-name">Settings</span>
<span class="ic-kt">Icons.Settings</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
<span class="ic-name">Bell</span>
<span class="ic-kt">Icons.Bell</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
<span class="ic-name">Search</span>
<span class="ic-kt">Icons.Search</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
<span class="ic-name">Plus</span>
<span class="ic-kt">Icons.Plus</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
<span class="ic-name">Close</span>
<span class="ic-kt">Icons.Close</span>
</div>

    </div>
  </div>

  <div class="comp-group">
    <h3>Actions &amp; Controls</h3>
    <div class="icon-grid">

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
<span class="ic-name">Arrow Right</span>
<span class="ic-kt">Icons.ArrowRight</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
<span class="ic-name">Arrow Left</span>
<span class="ic-kt">Icons.ArrowLeft</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><polyline points="9 18 15 12 9 6"/></svg>
<span class="ic-name">Chevron Right</span>
<span class="ic-kt">Icons.ChevronRight</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><polyline points="15 18 9 12 15 6"/></svg>
<span class="ic-name">Chevron Left</span>
<span class="ic-kt">Icons.ChevronLeft</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M20 6L9 17l-5-5"/></svg>
<span class="ic-name">Check</span>
<span class="ic-kt">Icons.Check</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
<span class="ic-name">Download</span>
<span class="ic-kt">Icons.Download</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><polyline points="10 3 15 8 10 13"/><line x1="15" y1="8" x2="3" y2="8"/></svg>
<span class="ic-name">Share</span>
<span class="ic-kt">Icons.Share</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
<span class="ic-name">Edit</span>
<span class="ic-kt">Icons.Edit</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r=".5" fill="currentColor"/></svg>
<span class="ic-name">Info</span>
<span class="ic-kt">Icons.Info</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
<span class="ic-name">Warning</span>
<span class="ic-kt">Icons.Warning</span>
</div>

    </div>
  </div>

  <div class="comp-group">
    <h3>Workout &amp; Fitness</h3>
    <div class="icon-grid">

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
<span class="ic-name">Timer</span>
<span class="ic-kt">Icons.Timer</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
<span class="ic-name">Heart Rate</span>
<span class="ic-kt">Icons.HeartRate</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
<span class="ic-name">Location</span>
<span class="ic-kt">Icons.Location</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
<span class="ic-name">Edit</span>
<span class="ic-kt">Icons.Edit</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
<span class="ic-name">Bag</span>
<span class="ic-kt">Icons.Bag</span>
</div>

<div class="ic-item">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 7-7"/><path d="M21 21v-2a7 7 0 0 0-7-7"/></svg>
<span class="ic-name">Group</span>
<span class="ic-kt">Icons.Group</span>
</div>

    </div>
  </div>
</div>

<div class="code-block">
<span class="cm">// TrainlyIcons.kt — ImageVector definitions for neo-brutalist icons</span>
<span class="cm">// All icons: 24×24 viewBox, 3px stroke, square caps, miter joins</span>
<span class="kw">object</span> Icons {
    <span class="kw">val</span> User = ImageVector {
        <span class="cm">// circle(12, 8, r=4) + path("M4 21v-2a8 8 0 0 1 16 0v2")</span>
    }
    <span class="kw">val</span> Mail = ImageVector {
        <span class="cm">// rect(3, 5, 18, 14, rx=2) + path("M3 7l9 6 9-6")</span>
    }
    <span class="kw">val</span> Lock = ImageVector {
        <span class="cm">// rect(5, 11, 14, 10, rx=1) + path("M8 11V7a4 4 0 0 1 8 0v4")</span>
    }
    <span class="kw">val</span> Eye = ImageVector {
        <span class="cm">// path("M2 12s3-7 10-7 10 7 10 7...") + circle(12, 12, r=3)</span>
    }
    <span class="kw">val</span> EyeOff = ImageVector {
        <span class="cm">// Eye path + slash line("M1 1l22 22")</span>
    }
}
</div>
</section>

<!-- ═══ NAVIGATION FLOW ═══ -->
<section class="section" id="flow">
<div class="section-header">
  <h2>Navigation Flow</h2>
  <span class="file-ref">authGraph in NavGraph.kt</span>
</div>
<div class="section-desc">
  Auth flow is contained within <span class="tag mono" style="font-size:11px;padding:2px 6px">authGraph</span>, a nested navigation graph. Successful login pops the entire auth graph and navigates to home.
</div>
<div class="flow-row" style="margin-bottom:var(--space-lg)">
  <span class="step" style="background:var(--accent)">Splash</span>
  <span class="arrow">→</span>
  <span class="step">Login</span>
  <span class="arrow">→</span>
  <span class="step" style="background:var(--success);color:#fff;border-color:var(--success)">Home</span>
</div>
<div class="flow-row">
  <span class="step" style="background:var(--accent)">Splash</span>
  <span class="arrow">→</span>
  <span class="step">Register</span>
  <span class="arrow">→</span>
  <span class="step" style="background:var(--success);color:#fff;border-color:var(--success)">Home</span>
</div>
<div class="code-block" style="margin-top:var(--space-xl)">
<span class="cm">// NavGraph.kt — Auth nested graph</span>
navigation(startDestination = <span class="str">"splash"</span>, route = <span class="str">"auth"</span>) {
    composable(<span class="str">"splash"</span>) {
        val viewModel: SplashViewModel = hiltViewModel()
        SplashScreen(
            uiState = viewModel.uiState.collectAsStateWithLifecycle().value,
            onNavigateToLogin = { navController.navigate(<span class="str">"auth/login"</span>) { popUpTo(<span class="str">"auth"</span>) { inclusive = <span class="kw">true</span> } } },
            onNavigateToHome = { navController.navigate(<span class="str">"home_graph"</span>) { popUpTo(<span class="num">0</span>) } }
        )
    }
    composable(<span class="str">"login"</span>) {
        val viewModel: LoginViewModel = hiltViewModel()
        LoginScreen(
            uiState = viewModel.uiState.collectAsStateWithLifecycle().value,
            onEmailChange = viewModel::onEmailChange,
            onPasswordChange = viewModel::onPasswordChange,
            onLoginClick = viewModel::login,
            onGoogleLogin = viewModel::loginWithGoogle,
            onAppleLogin = viewModel::loginWithApple,
            onForgotPassword = { <span class="cm">/* navigate to reset flow */</span> },
            onRegisterClick = { navController.navigate(<span class="str">"auth/register"</span>) }
        )
    }
    composable(<span class="str">"register"</span>) {
        val viewModel: RegisterViewModel = hiltViewModel()
        RegisterScreen(
            uiState = viewModel.uiState.collectAsStateWithLifecycle().value,
            onSubmit = {
                viewModel.register()
                <span class="cm">// On success: navigate to home_graph</span>
            }
        )
    }
}
</div>
</section>

<!-- ═══ STATE MATRIX ═══ -->
<section class="section" id="states">
<div class="section-header">
  <h2>State Matrix</h2>
  <span class="file-ref">ScreenUiState.kt</span>
</div>
<div class="section-desc">
  Every auth screen implements a sealed UiState class. The ViewModel owns state transitions; the composable renders the current state. No inline ViewModels.
</div>

<table style="width:100%;border-collapse:collapse;font-size:14px;margin:var(--space-lg) 0">
  <tr>
    <th style="text-align:left;padding:var(--space-sm) var(--space-md);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:3px solid var(--border);background:var(--surface);color:var(--muted)">Screen</th>
    <th style="text-align:left;padding:var(--space-sm) var(--space-md);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:3px solid var(--border);background:var(--surface);color:var(--muted)">Idle</th>
    <th style="text-align:left;padding:var(--space-sm) var(--space-md);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:3px solid var(--border);background:var(--surface);color:var(--muted)">Loading</th>
    <th style="text-align:left;padding:var(--space-sm) var(--space-md);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:3px solid var(--border);background:var(--surface);color:var(--muted)">Error</th>
    <th style="text-align:left;padding:var(--space-sm) var(--space-md);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:3px solid var(--border);background:var(--surface);color:var(--muted)">Offline</th>
  </tr>
  <tr>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border);font-weight:700">Splash</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Logo + auth check spinner</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Dark bg, pulse logo, progress bar</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">N/A — errors redirect</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Warning card, retry button</td>
  </tr>
  <tr>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border);font-weight:700">Login</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Form enabled, CTA ready</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Button spinner, inputs disabled</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Inline error card + field errors</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Banner: login requires connection</td>
  </tr>
  <tr>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border);font-weight:700">Register</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Form ready, all steps editable</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Submitting state, button spinner</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Inline per-step validation errors</td>
    <td style="padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border)">Banner: registration requires connection</td>
  </tr>
</table>

<div class="code-block">
<span class="cm">// ScreenUiState.kt — Shared sealed class for all screens</span>
sealed <span class="kw">class</span> ScreenUiState&lt;<span class="kw">out</span> T&gt; {
    <span class="kw">data object</span> Loading : ScreenUiState&lt;Nothing&gt;()
    <span class="kw">data class</span> Content&lt;T&gt;(<span class="kw">val</span> data: T) : ScreenUiState&lt;T&gt;()
    <span class="kw">data class</span> Error(<span class="kw">val</span> message: String) : ScreenUiState&lt;Nothing&gt;()
    <span class="kw">data object</span> Offline : ScreenUiState&lt;Nothing&gt;()
}
</div>
</section>

<!-- ═══ CODE ═══ -->
<section class="section" id="code">
<div class="section-header">
  <h2>AuthGraph.kt</h2>
  <span class="file-ref">full reference</span>
</div>
<div class="section-desc">
  Complete navigation graph setup for the auth family. Routes: <span class="tag mono" style="font-size:11px;padding:2px 6px">auth/splash</span>, <span class="tag mono" style="font-size:11px;padding:2px 6px">auth/login</span>, <span class="tag mono" style="font-size:11px;padding:2px 6px">auth/register</span>.
</div>
<div class="rule-list" style="margin-bottom:var(--space-lg)">
  <div class="rule-item"><span class="r-icon">1</span> Splash auto-navigates after 1.5s — pops auth graph on success</div>
  <div class="rule-item"><span class="r-icon">2</span> Login success pops entire auth graph, navigates to home_graph</div>
  <div class="rule-item"><span class="r-icon">3</span> Register success navigates to home_graph, pops auth</div>
  <div class="rule-item"><span class="r-icon">4</span> Register is multi-step (3 steps) — state managed in RegisterViewModel</div>
  <div class="rule-item"><span class="r-icon">5</span> No dead-end tabs — auth is not a tab, it's a pre-navigation graph</div>
</div>

<div class="code-block" style="margin-top:var(--space-lg)">
<span class="cm">// AuthViewModel.kt — Shared auth logic</span>
@HiltViewModel
<span class="kw">class</span> AuthViewModel @Inject <span class="kw">constructor</span>(
    <span class="kw">private</span> <span class="kw">val</span> authRepository: AuthRepository,
    <span class="kw">private</span> <span class="kw">val</span> connectivityObserver: ConnectivityObserver
) : ViewModel() {
    <span class="kw">private</span> <span class="kw">val</span> _uiState = MutableStateFlow&lt;SplashUiState&gt;(SplashUiState.Loading)
    <span class="kw">val</span> uiState: StateFlow&lt;SplashUiState&gt; = _uiState.asStateFlow()

    <span class="kw">init</span> {
        viewModelScope.launch {
            connectivityObserver.observe().collect { status ->
                <span class="kw">if</span> (status == ConnectivityStatus.Unavailable) {
                    _uiState.value = SplashUiState.Offline
                } <span class="kw">else</span> {
                    checkAuthState()
                }
            }
        }
    }

    <span class="kw">private fun</span> checkAuthState() {
        viewModelScope.launch {
            _uiState.value = SplashUiState.Loading
            <span class="kw">val</span> isAuthenticated = authRepository.isAuthenticated()
            _uiState.value = <span class="kw">if</span> (isAuthenticated)
                SplashUiState.Authenticated
            <span class="kw">else</span>
                SplashUiState.Unauthenticated
        }
    }
}

<span class="cm">// SplashUiState.kt</span>
sealed <span class="kw">class</span> SplashUiState {
    <span class="kw">data object</span> Loading : SplashUiState()
    <span class="kw">data object</span> Offline : SplashUiState()
    <span class="kw">data object</span> Authenticated : SplashUiState()
    <span class="kw">data object</span> Unauthenticated : SplashUiState()
}
</div>
</section>

</div>
</div>

<script>
// ── Eye toggle for password visibility ──
function togglePasswordVisibility(inputId, iconId, btn) {
  const input = document.getElementById(inputId);
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  btn.classList.toggle('active');

  // Swap SVG between Eye and EyeOff
  const icon = document.getElementById(iconId);
  if (isPassword) {
    icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.06 3.06M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/>';
  } else {
    icon.innerHTML = '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>';
  }
}

// ── Login state toggle ──
document.querySelectorAll('#loginToggle button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#loginToggle button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const state = this.dataset.state;
    const offlineBanner = document.getElementById('loginOfflineBanner');
    const errorCard = document.getElementById('loginErrorCard');
    const loginBtn = document.getElementById('loginBtn');
    const emailGroup = document.getElementById('loginEmailGroup');
    const passwordGroup = document.getElementById('loginPasswordGroup');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    offlineBanner.style.display = 'none';
    errorCard.style.display = 'none';
    loginBtn.classList.remove('loading');
    loginBtn.querySelector('span').textContent = 'Log In';
    loginBtn.disabled = false;
    loginBtn.style.opacity = 1;
    emailInput.disabled = false;
    passwordInput.disabled = false;
    emailGroup.classList.remove('error');
    passwordGroup.classList.remove('error');

    switch(state) {
      case 'loading':
        loginBtn.classList.add('loading');
        emailInput.disabled = true;
        passwordInput.disabled = true;
        break;
      case 'error':
        errorCard.style.display = 'flex';
        document.getElementById('loginErrorText').textContent = 'Invalid email or password. Please try again.';
        emailGroup.classList.add('error');
        passwordGroup.classList.add('error');
        break;
      case 'offline':
        offlineBanner.style.display = 'flex';
        loginBtn.querySelector('span').textContent = 'Log In';
        loginBtn.disabled = true;
        loginBtn.style.opacity = .4;
        emailInput.disabled = true;
        passwordInput.disabled = true;
        break;
    }
  });
});

// ── Register step toggle ──
document.querySelectorAll('#registerToggle button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#registerToggle button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const step = parseInt(this.dataset.step);

    for (let i = 1; i <= 3; i++) {
      document.getElementById('regStep' + i).className = i === step ? 'reg-step-visible' : 'reg-step-hidden';
    }

    const dot2 = document.getElementById('dot2');
    const dot3 = document.getElementById('dot3');
    const conn1 = document.getElementById('conn1');
    const conn2 = document.getElementById('conn2');

    if (step >= 2) { dot2.classList.add('completed'); dot2.classList.remove('active'); } else { dot2.classList.remove('completed'); dot2.classList.add('active'); }
    if (step >= 3) { dot3.classList.add('completed'); dot3.classList.remove('active'); } else { dot3.classList.remove('completed'); }
    if (step === 1) { dot2.classList.add('active'); dot2.classList.remove('completed'); }

    conn1.style.background = step >= 2 ? 'var(--border)' : '';
    conn2.style.background = step >= 3 ? 'var(--border)' : '';
  });
});
</script>
</body>
</html>
