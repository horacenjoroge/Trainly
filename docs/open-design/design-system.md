<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — Neo-Brutalist Design System Spec</title>
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
  --shadow-offset:5px;
  --header-h:56px;--bottom-nav-h:64px;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font-body);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}

/* ── Layout ── */
.layout{display:flex;min-height:100vh}
.sidebar{width:260px;flex-shrink:0;background:var(--surface);border-right:4px solid var(--border);padding:var(--space-xl);position:sticky;top:0;height:100vh;overflow-y:auto}
.sidebar .logo{font-size:21px;font-weight:800;letter-spacing:-0.02em;margin-bottom:var(--space-xl);display:flex;align-items:center;gap:var(--space-sm)}
.sidebar .logo span{display:inline-block;width:24px;height:24px;background:var(--accent);border:3px solid var(--border);transform:rotate(12deg)}
.sidebar nav{display:flex;flex-direction:column;gap:2px}
.sidebar nav a{color:var(--fg);text-decoration:none;padding:var(--space-sm) var(--space-md);font-weight:600;font-size:13px;border:2px solid transparent;transition:all .1s}
.sidebar nav a:hover,.sidebar nav a.active{background:var(--accent);border-color:var(--border);transform:translate(-1px,-1px);box-shadow:2px 2px 0 var(--border)}
.sidebar .nav-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:var(--space-lg) 0 var(--space-sm) var(--space-md)}
.main{flex:1;padding:0;max-width:100%}

/* ── Hero ── */
.hero{background:var(--accent);border-bottom:4px solid var(--border);padding:var(--space-2xl) var(--space-xl);margin-bottom:0}
.hero h1{font-size:clamp(36px,6vw,56px);font-weight:900;letter-spacing:-0.03em;line-height:1.05}
.hero p{font-size:clamp(17px,2.5vw,21px);font-weight:500;margin-top:var(--space-md);max-width:600px;line-height:1.4}
.hero .meta-row{display:flex;gap:var(--space-xl);margin-top:var(--space-xl);font-size:13px;font-weight:600;flex-wrap:wrap}
.hero .meta-row span{display:flex;align-items:center;gap:var(--space-xs)}

/* ── Section ── */
.section{padding:var(--space-2xl) var(--space-xl);border-bottom:3px solid var(--border)}
.section:last-child{border-bottom:none}
.section-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:var(--space-xl);flex-wrap:wrap;gap:var(--space-md)}
.section-header h2{font-size:27px;font-weight:800;letter-spacing:-0.02em}
.section-header .file-ref{font-family:var(--font-mono);font-size:12px;color:var(--muted);font-weight:500}
.section-desc{font-size:15px;color:var(--muted);margin-bottom:var(--space-xl);max-width:720px}

/* ── Token Grid ── */
.token-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-lg)}
.token-grid.wide{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
.token-card{border:var(--border-w) solid var(--border);background:var(--surface);overflow:hidden;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.token-card .swatch{height:80px;display:flex;align-items:flex-end;padding:var(--space-sm);font-family:var(--font-mono);font-size:11px;font-weight:600;line-height:1.3}
.token-card .swatch.dark-text{color:#fff}
.token-card .info{padding:var(--space-md)}
.token-card .info .name{font-weight:800;font-size:14px;margin-bottom:2px;text-transform:uppercase;letter-spacing:.03em}
.token-card .info .value{font-family:var(--font-mono);font-size:11px;color:var(--muted)}

/* ── Typography Scale ── */
.type-scale{display:grid;gap:var(--space-lg)}
.type-row{border:var(--border-w) solid var(--border);padding:var(--space-lg);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);background:var(--surface)}
.type-row .preview{font-family:var(--font-display)}
.type-row .meta-row{display:flex;gap:var(--space-xl);margin-top:var(--space-sm);font-size:12px;color:var(--muted);font-family:var(--font-mono)}

/* ── Spacing ── */
.spacing-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--space-md)}
.spacing-item{border:var(--border-w) solid var(--border);padding:var(--space-md);background:var(--surface);transform:translate(-2px,-2px);box-shadow:3px 3px 0 var(--border)}
.spacing-item .bar{background:var(--accent);border:2px solid var(--border);margin-bottom:var(--space-sm);min-height:8px}
.spacing-item .name{font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:.03em}
.spacing-item .value{font-family:var(--font-mono);font-size:11px;color:var(--muted)}

/* ── Border & Shadow ── */
.demo-row{display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:flex-start}
.demo-box{width:120px;height:80px;background:var(--surface);border:var(--border-w) solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;text-align:center;padding:var(--space-sm)}
.shadow-card{border:var(--border-w) solid var(--border);background:var(--surface);padding:var(--space-lg);text-align:center;font-weight:700;font-size:13px}

/* ── Component Showcase ── */
.component-showcase{display:flex;flex-direction:column;gap:var(--space-xl)}
.comp-row{display:flex;flex-wrap:wrap;gap:var(--space-lg);align-items:center}
.comp-group{border:var(--border-w) solid var(--border);padding:var(--space-xl);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);min-width:280px;flex:1}
.comp-group h3{font-size:17px;font-weight:800;margin-bottom:var(--space-lg);display:flex;align-items:center;justify-content:space-between}
.comp-group h3 .kt{font-family:var(--font-mono);font-size:11px;font-weight:500;color:var(--muted)}
.comp-group h4{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:var(--space-md)}

/* ── Trainly Components ── */

/* Buttons */
.tn-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-sm);font-family:var(--font-body);font-weight:800;border:var(--border-w) solid var(--border);cursor:pointer;transition:all .1s;text-decoration:none;white-space:nowrap;font-size:15px;padding:var(--space-md) var(--space-xl);min-height:48px;min-width:48px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);-webkit-tap-highlight-color:transparent}
.tn-btn:active{transform:translate(0,0);box-shadow:0 0 0 var(--border)}
.tn-btn.primary{background:var(--accent);color:var(--fg)}
.tn-btn.secondary{background:var(--secondary);color:#fff}
.tn-btn.outline{background:var(--surface);color:var(--fg)}
.tn-btn.ghost{background:transparent;color:var(--fg);border-color:transparent;box-shadow:none;transform:none}
.tn-btn.small{font-size:13px;padding:var(--space-sm) var(--space-md);min-height:36px}
.tn-btn.large{padding:var(--space-lg) var(--space-2xl);font-size:17px;min-height:56px}
.tn-btn.icon-only{padding:var(--space-sm);width:48px}
.tn-btn:disabled{opacity:.4;pointer-events:none}
.tn-btn.danger{background:var(--danger);color:#fff}
.tn-btn.loading{position:relative;color:transparent}
.tn-btn.loading::after{content:'';position:absolute;width:20px;height:20px;border:3px solid var(--border);border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* Inputs */
.tn-input-wrap{display:flex;flex-direction:column;gap:var(--space-sm);width:100%;max-width:360px}
.tn-input-wrap .label{font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.03em}
.tn-input{font-family:var(--font-body);font-size:15px;padding:var(--space-md) var(--space-lg);border:var(--border-w) solid var(--border);background:var(--surface);color:var(--fg);outline:none;width:100%;min-height:48px;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);transition:all .1s}
.tn-input:focus{background:var(--accent);border-color:var(--border);transform:translate(0,0);box-shadow:0 0 0 var(--border)}
.tn-input.error{border-color:var(--danger)}
.tn-input.error:focus{background:#FEF2F2}
.tn-input-wrap .hint{font-size:12px;color:var(--muted)}
.tn-input-wrap .error-text{font-size:12px;color:var(--danger);font-weight:600}
textarea.tn-input{min-height:100px;resize:vertical}

/* Cards */
.tn-card{border:var(--border-w) solid var(--border);background:var(--surface);padding:var(--space-xl);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);display:flex;flex-direction:column;gap:var(--space-md)}
.tn-card.interactive{cursor:pointer;transition:all .12s}
.tn-card.interactive:hover{transform:translate(0,0);box-shadow:0 0 0 var(--border)}
.tn-card .card-title{font-weight:800;font-size:17px;letter-spacing:-0.01em}
.tn-card .card-body{font-size:15px;color:var(--muted);line-height:1.5}
.tn-card .card-footer{font-size:13px;font-weight:600;display:flex;align-items:center;gap:var(--space-sm);margin-top:auto}
.tn-card.accent{border-color:var(--accent);box-shadow:4px 4px 0 var(--accent)}
.tn-card.image-card{padding:0;overflow:hidden}
.tn-card.image-card .card-img{height:160px;background:#E5E7EB;border-bottom:var(--border-w) solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--muted);font-size:13px}
.tn-card.image-card .card-content{padding:var(--space-xl)}

/* Top Bar */
.tn-topbar{display:flex;align-items:center;padding:0 var(--space-lg);height:var(--header-h);border-bottom:var(--border-w) solid var(--border);background:var(--surface);gap:var(--space-md)}
.tn-topbar .back{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:2px solid var(--border);cursor:pointer;font-weight:700;font-size:18px;flex-shrink:0}
.tn-topbar .title{font-weight:800;font-size:17px;flex:1}
.tn-topbar .actions{display:flex;gap:var(--space-xs)}

/* Bottom Nav */
.tn-bottom-nav{display:flex;height:var(--bottom-nav-h);border-top:var(--border-w) solid var(--border);background:var(--surface)}
.tn-bottom-nav .nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);border:none;background:none;font-family:var(--font-body);transition:all .1s;padding:var(--space-xs);-webkit-tap-highlight-color:transparent}
.tn-bottom-nav .nav-item .icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid transparent}
.tn-bottom-nav .nav-item.active{color:var(--fg)}
.tn-bottom-nav .nav-item.active .icon{border-color:var(--border);background:var(--accent)}
.tn-bottom-nav .nav-item:active{opacity:.6}

/* Scaffold preview */
.scaffold-preview{width:100%;max-width:390px;border:var(--border-w) solid var(--border);background:var(--surface);overflow:hidden;position:relative;min-height:500px;display:flex;flex-direction:column}
.scaffold-preview .sp-body{flex:1;padding:var(--space-lg);display:flex;flex-direction:column;gap:var(--space-md);overflow-y:auto}
.scaffold-preview .sp-body .sp-card{height:60px;border:2px solid var(--border);display:flex;align-items:center;padding:var(--space-md);font-weight:600;font-size:13px;background:var(--bg)}
.scaffold-preview .sp-body .sp-card:last-child{opacity:.5}

/* Dialog */
.dialog-overlay{position:fixed;inset:0;background:rgba(28,41,60,.5);display:flex;align-items:center;justify-content:center;z-index:100;padding:var(--space-lg)}
.tn-dialog{background:var(--surface);border:var(--border-w) solid var(--border);padding:var(--space-xl);max-width:400px;width:100%;transform:translate(-3px,-3px);box-shadow:8px 8px 0 var(--border)}
.tn-dialog .dialog-title{font-size:21px;font-weight:800;margin-bottom:var(--space-md)}
.tn-dialog .dialog-text{font-size:15px;color:var(--muted);margin-bottom:var(--space-xl);line-height:1.5}
.tn-dialog .dialog-actions{display:flex;gap:var(--space-md);justify-content:flex-end;flex-wrap:wrap}

/* Chip */
.tn-chip{display:inline-flex;align-items:center;gap:var(--space-xs);padding:var(--space-xs) var(--space-md);border:var(--border-w) solid var(--border);font-family:var(--font-body);font-size:13px;font-weight:700;background:var(--surface);cursor:pointer;transition:all .1s;transform:translate(-1px,-1px);box-shadow:2px 2px 0 var(--border);-webkit-tap-highlight-color:transparent}
.tn-chip:active{transform:translate(0,0);box-shadow:none}
.tn-chip.selected{background:var(--accent)}
.tn-chip.secondary{background:var(--secondary);color:#fff}
.tn-chip .close{width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid var(--border);cursor:pointer;line-height:1;margin-left:var(--space-xs);background:var(--surface)}
.tn-chip .close:active{background:var(--accent)}

/* Badge */
.tn-badge{display:inline-flex;align-items:center;padding:2px var(--space-sm);font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border:2px solid var(--border);line-height:1.2}
.tn-badge.accent{background:var(--accent);color:var(--fg)}
.tn-badge.secondary{background:var(--secondary);color:#fff}
.tn-badge.success{background:var(--success);color:#fff}
.tn-badge.warning{background:var(--warning);color:#fff}
.tn-badge.danger{background:var(--danger);color:#fff}
.tn-badge.outline{background:transparent;color:var(--fg)}

/* Empty State */
.tn-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-2xl);text-align:center;border:var(--border-w) solid var(--border);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);gap:var(--space-md)}
.tn-empty .empty-icon{width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;border:var(--border-w) solid var(--border);background:var(--bg)}
.tn-empty .empty-title{font-size:21px;font-weight:800}
.tn-empty .empty-text{font-size:15px;color:var(--muted);max-width:320px}

/* Loading */
.tn-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-lg);padding:var(--space-2xl)}
.tn-loading .spinner{width:40px;height:40px;border:4px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite}
.tn-loading .load-text{font-size:13px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.tn-loading.inline{flex-direction:row;padding:var(--space-md)}
.tn-loading.inline .spinner{width:24px;height:24px;border-width:3px}
.tn-loading.fullscreen{min-height:300px}

/* Color row for demo */
.color-row{display:flex;gap:0;border:var(--border-w) solid var(--border);overflow:hidden;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.color-row .cr{flex:1;height:48px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;letter-spacing:.02em}
.color-row .cr.dark-text{color:#fff}

/* Code Block */
.code-block{background:#1C293C;color:#E5E7EB;padding:var(--space-lg);font-family:var(--font-mono);font-size:13px;line-height:1.6;overflow-x:auto;border:var(--border-w) solid var(--border);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);margin-top:var(--space-lg)}
.code-block .kw{color:#FDC800}
.code-block .str{color:#16A34A}
.code-block .cm{color:#6B7280;font-style:italic}
.code-block .tp{color:#93C5FD}
.code-block .fn{color:#A78BFA}
.code-block .num{color:#FDBA74}

/* Responsive */
@media(max-width:768px){
  .sidebar{display:none}
  .hero{padding:var(--space-xl) var(--space-lg)}
  .section{padding:var(--space-xl) var(--space-lg)}
  .token-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
}
</style>
</head>
<body>
<div class="layout">
<aside class="sidebar">
  <div class="logo"><span></span> Trainly</div>
  <div class="nav-label">Foundation</div>
  <nav>
    <a href="#colors">Color System</a>
    <a href="#typography">Typography</a>
    <a href="#spacing">Spacing</a>
    <a href="#borders">Borders</a>
    <a href="#shadows">Shadows &amp; Elevation</a>
  </nav>
  <div class="nav-label">Components</div>
  <nav>
    <a href="#button">TrainlyButton</a>
    <a href="#card">TrainlyCard</a>
    <a href="#input">TrainlyInput</a>
    <a href="#topbar">TrainlyTopBar</a>
    <a href="#bottombar">TrainlyBottomBar</a>
    <a href="#scaffold">TrainlyScaffold</a>
    <a href="#dialog">TrainlyDialog</a>
    <a href="#chip">TrainlyChip</a>
    <a href="#badge">TrainlyBadge</a>
    <a href="#emptystate">TrainlyEmptyState</a>
    <a href="#loading">TrainlyLoading</a>
  </nav>
</aside>

<div class="main">
<section class="hero">
  <h1>Neo-Brutalist<br>Design System</h1>
  <p>Bold, memorable, mobile-native. A centralized design language for Trainly's Jetpack Compose Android application.</p>
  <div class="meta-row">
    <span>→ 10 theme files</span>
    <span>→ 11 core components</span>
    <span>→ Production-ready tokens</span>
    <span>→ Material 3 compatible</span>
  </div>
</section>

<!-- ─── Color System ─── -->
<section class="section" id="colors">
  <div class="section-header">
    <h2>Color System</h2>
    <span class="file-ref">Color.kt · NeoBrutalTokens.kt</span>
  </div>
  <div class="section-desc">
    High-contrast palette built around a bold yellow primary and deep navy text. Every token is accessible at WCAG AA minimum.
    The accent is lean and controlled — used at most twice per screen.
  </div>
  <div class="token-grid">
    <div class="token-card">
      <div class="swatch" style="background:#FDC800;color:#1C293C">Primary<br>#FDC800</div>
      <div class="info"><div class="name">Primary</div><div class="value">#FDC800 / oklch(85% 0.18 85)</div></div>
    </div>
    <div class="token-card">
      <div class="swatch dark-text" style="background:#432DD7;color:#fff">Secondary<br>#432DD7</div>
      <div class="info"><div class="name">Secondary</div><div class="value">#432DD7 / oklch(42% 0.22 275)</div></div>
    </div>
    <div class="token-card">
      <div class="swatch dark-text" style="background:#16A34A;color:#fff">Success<br>#16A34A</div>
      <div class="info"><div class="name">Success</div><div class="value">#16A34A / oklch(58% 0.18 145)</div></div>
    </div>
    <div class="token-card">
      <div class="swatch dark-text" style="background:#D97706;color:#fff">Warning<br>#D97706</div>
      <div class="info"><div class="name">Warning</div><div class="value">#D97706 / oklch(65% 0.18 75)</div></div>
    </div>
    <div class="token-card">
      <div class="swatch dark-text" style="background:#DC2626;color:#fff">Danger<br>#DC2626</div>
      <div class="info"><div class="name">Danger</div><div class="value">#DC2626 / oklch(55% 0.22 30)</div></div>
    </div>
    <div class="token-card">
      <div class="swatch" style="background:#FBFBF9;color:#1C293C;border-bottom:2px solid #1C293C">Surface<br>#FBFBF9</div>
      <div class="info"><div class="name">Surface</div><div class="value">#FBFBF9 / oklch(99% 0.002 85)</div></div>
    </div>
    <div class="token-card">
      <div class="swatch dark-text" style="background:#1C293C;color:#fff">Text<br>#1C293C</div>
      <div class="info"><div class="name">Text / Foreground</div><div class="value">#1C293C / oklch(22% 0.03 260)</div></div>
    </div>
    <div class="token-card">
      <div class="swatch dark-text" style="background:#5A6B7E;color:#fff">Muted<br>#5A6B7E</div>
      <div class="info"><div class="name">Muted / Caption</div><div class="value">#5A6B7E / oklch(50% 0.02 260)</div></div>
    </div>
  </div>

  <div style="margin-top:var(--space-xl)">
    <div class="section-header"><h3 style="font-size:17px;font-weight:800">Semantic Mapping</h3></div>
    <div class="code-block">
<span class="cm">// Color.kt — Core palette</span>
<span class="kw">object</span> TrainlyColors {
    <span class="kw">val</span> Primary       = Color(<span class="str">0xFFFDC800</span>)  <span class="cm">// CTA, highlights, selection</span>
    <span class="kw">val</span> Secondary     = Color(<span class="str">0xFF432DD7</span>)  <span class="cm">// Secondary actions, links</span>
    <span class="kw">val</span> Success       = Color(<span class="str">0xFF16A34A</span>)  <span class="cm">// Positive metrics, confirmations</span>
    <span class="kw">val</span> Warning       = Color(<span class="str">0xFFD97706</span>)  <span class="cm">// Caution states</span>
    <span class="kw">val</span> Danger        = Color(<span class="str">0xFFDC2626</span>)  <span class="cm">// Errors, destructive actions</span>
    <span class="kw">val</span> Surface       = Color(<span class="str">0xFFFBFBF9</span>)  <span class="cm">// Cards, backgrounds</span>
    <span class="kw">val</span> TextPrimary   = Color(<span class="str">0xFF1C293C</span>)  <span class="cm">// Body, headings</span>
    <span class="kw">val</span> TextMuted     = Color(<span class="str">0xFF5A6B7E</span>)  <span class="cm">// Captions, metadata</span>
    <span class="kw">val</span> Border        = Color(<span class="str">0xFF1C293C</span>)  <span class="cm">// All borders</span>
}
    </div>
  </div>
</section>

<!-- ─── Typography ─── -->
<section class="section" id="typography">
  <div class="section-header">
    <h2>Typography</h2>
    <span class="file-ref">Typography.kt</span>
  </div>
  <div class="section-desc">
    Bold modern sans-serif hierarchy using Inter across all weights. Headlines use 800–900 weight with tight letter-spacing.
    Body at 15px for optimal mobile readability. Monospace reserved for data, metrics, and code.
  </div>

  <div class="type-scale">
    <div class="type-row">
      <div class="preview" style="font-size:35px;font-weight:900;letter-spacing:-0.03em">Display / H1 — 35sp</div>
      <div class="meta-row"><span>Weight 900</span><span>Letter-spacing -0.03em</span><span>Line height 1.1</span></div>
    </div>
    <div class="type-row">
      <div class="preview" style="font-size:27px;font-weight:800;letter-spacing:-0.02em">Heading / H2 — 27sp</div>
      <div class="meta-row"><span>Weight 800</span><span>Letter-spacing -0.02em</span><span>Line height 1.2</span></div>
    </div>
    <div class="type-row">
      <div class="preview" style="font-size:21px;font-weight:700;letter-spacing:-0.01em">Subhead / H3 — 21sp</div>
      <div class="meta-row"><span>Weight 700</span><span>Letter-spacing -0.01em</span><span>Line height 1.3</span></div>
    </div>
    <div class="type-row">
      <div class="preview" style="font-size:17px;font-weight:600">Body Large / H4 — 17sp</div>
      <div class="meta-row"><span>Weight 600</span><span>Letter-spacing 0</span><span>Line height 1.4</span></div>
    </div>
    <div class="type-row">
      <div class="preview" style="font-size:15px;font-weight:400">Body — 15sp</div>
      <div class="meta-row"><span>Weight 400</span><span>Letter-spacing 0</span><span>Line height 1.5</span></div>
    </div>
    <div class="type-row">
      <div class="preview" style="font-size:13px;font-weight:600;text-transform:uppercase">Caption / Label — 13sp</div>
      <div class="meta-row"><span>Weight 600</span><span>Uppercase</span><span>Letter-spacing 0.05em</span></div>
    </div>
    <div class="type-row">
      <div class="preview" style="font-family:var(--font-mono);font-size:13px;font-weight:500">Mono — JetBrains Mono 13sp · 1,024 kcal · 8.2 km</div>
      <div class="meta-row"><span>Font: JetBrains Mono</span><span>Weight 500</span><span>Tabular numbers</span></div>
    </div>
  </div>

  <div class="code-block" style="margin-top:var(--space-xl)">
<span class="cm">// Typography.kt</span>
<span class="kw">val</span> TrainlyTypography = Typography(
    displayLarge   = TextStyle(<span class="cm">/* 35sp, 900, -0.03em */</span>),
    headlineLarge  = TextStyle(<span class="cm">/* 27sp, 800, -0.02em */</span>),
    titleLarge     = TextStyle(<span class="cm">/* 21sp, 700, -0.01em */</span>),
    titleMedium    = TextStyle(<span class="cm">/* 17sp, 600 */</span>),
    bodyLarge      = TextStyle(<span class="cm">/* 15sp, 400 */</span>),
    labelMedium    = TextStyle(<span class="cm">/* 13sp, 600, uppercase */</span>),
    labelSmall     = TextStyle(<span class="cm">/* 11sp, 700, uppercase, .08em */</span>)
)
  </div>
</section>

<!-- ─── Spacing ─── -->
<section class="section" id="spacing">
  <div class="section-header">
    <h2>Spacing</h2>
    <span class="file-ref">Spacing.kt · Dimensions.kt</span>
  </div>
  <div class="section-desc">
    Six-step scale. All spacing, padding, and gap decisions derive from these tokens. No ad-hoc values.
  </div>
  <div class="spacing-grid">
    <div class="spacing-item"><div class="bar" style="width:4px"></div><div class="name">XXS</div><div class="value">4dp</div></div>
    <div class="spacing-item"><div class="bar" style="width:8px"></div><div class="name">XS</div><div class="value">8dp</div></div>
    <div class="spacing-item"><div class="bar" style="width:12px"></div><div class="name">SM</div><div class="value">12dp</div></div>
    <div class="spacing-item"><div class="bar" style="width:16px"></div><div class="name">MD</div><div class="value">16dp</div></div>
    <div class="spacing-item"><div class="bar" style="width:24px"></div><div class="name">LG</div><div class="value">24dp</div></div>
    <div class="spacing-item"><div class="bar" style="width:32px"></div><div class="name">XL</div><div class="value">32dp</div></div>
  </div>

  <div class="code-block" style="margin-top:var(--space-xl)">
<span class="cm">// Spacing.kt</span>
<span class="kw">object</span> TrainlySpacing {
    <span class="kw">val</span> xxs = 4.dp
    <span class="kw">val</span> xs  = 8.dp
    <span class="kw">val</span> sm  = 12.dp
    <span class="kw">val</span> md  = 16.dp
    <span class="kw">val</span> lg  = 24.dp
    <span class="kw">val</span> xl  = 32.dp
}
  </div>
</section>

<!-- ─── Borders ─── -->
<section class="section" id="borders">
  <div class="section-header">
    <h2>Borders</h2>
    <span class="file-ref">Borders.kt · Shapes.kt</span>
  </div>
  <div class="section-desc">
    Thick visible borders are the signature of the neo-brutalist system. Every component has a hard border.
    Radii are minimal — sharp corners with slight softening at larger sizes.
  </div>
  <div class="token-grid wide">
    <div class="token-card">
      <div class="info"><div class="name">Border Width — Thin</div><div class="value">2dp</div></div>
      <div style="height:3px;background:var(--border);margin:0 var(--space-md) var(--space-md)"></div>
    </div>
    <div class="token-card">
      <div class="info"><div class="name">Border Width — Default</div><div class="value">3dp</div></div>
      <div style="height:4px;background:var(--border);margin:0 var(--space-md) var(--space-md)"></div>
    </div>
    <div class="token-card">
      <div class="info"><div class="name">Border Width — Thick</div><div class="value">4dp</div></div>
      <div style="height:5px;background:var(--border);margin:0 var(--space-md) var(--space-md)"></div>
    </div>
    <div class="token-card">
      <div class="info"><div class="name">Radius — Sharp</div><div class="value">0dp</div></div>
      <div style="height:12px;background:var(--border);margin:0 var(--space-md) var(--space-md);border-radius:0"></div>
    </div>
    <div class="token-card">
      <div class="info"><div class="name">Radius — Small</div><div class="value">3dp</div></div>
      <div style="height:12px;background:var(--border);margin:0 var(--space-md) var(--space-md);border-radius:3px"></div>
    </div>
    <div class="token-card">
      <div class="info"><div class="name">Radius — Medium</div><div class="value">6dp</div></div>
      <div style="height:12px;background:var(--border);margin:0 var(--space-md) var(--space-md);border-radius:6px"></div>
    </div>
  </div>

  <div class="code-block" style="margin-top:var(--space-xl)">
<span class="cm">// Borders.kt</span>
<span class="kw">object</span> TrainlyBorders {
    <span class="kw">val</span> thin   = 2.dp
    <span class="kw">val</span> default = 3.dp
    <span class="kw">val</span> thick  = 4.dp
}

<span class="cm">// Shapes.kt</span>
<span class="kw">object</span> TrainlyShapes {
    <span class="kw">val</span> sharp    = RoundedCornerShape(0.dp)
    <span class="kw">val</span> small    = RoundedCornerShape(3.dp)
    <span class="kw">val</span> medium   = RoundedCornerShape(6.dp)
    <span class="kw">val</span> large    = RoundedCornerShape(8.dp)
}
  </div>
</section>

<!-- ─── Shadows & Elevation ─── -->
<section class="section" id="shadows">
  <div class="section-header">
    <h2>Shadows &amp; Elevation</h2>
    <span class="file-ref">Shadows.kt · Elevation.kt</span>
  </div>
  <div class="section-desc">
    Hard offset shadows replace soft Material elevation. Each level shifts the component physically — the shadow is a solid dark rectangle offset by the step value. No blur, no opacity gradients.
  </div>
  <div class="demo-row">
    <div class="shadow-card" style="transform:translate(-2px,-2px);box-shadow:3px 3px 0 var(--border)">
      <span style="font-size:11px;font-weight:600;display:block">Level 1</span>
      offset(2dp, 2dp)<br>no blur
    </div>
    <div class="shadow-card" style="transform:translate(-3px,-3px);box-shadow:5px 5px 0 var(--border)">
      <span style="font-size:11px;font-weight:600;display:block">Level 2</span>
      offset(3dp, 3dp)<br>default
    </div>
    <div class="shadow-card" style="transform:translate(-4px,-4px);box-shadow:8px 8px 0 var(--border)">
      <span style="font-size:11px;font-weight:600;display:block">Level 3</span>
      offset(4dp, 4dp)<br>elevated
    </div>
    <div class="shadow-card" style="transform:translate(-5px,-5px);box-shadow:12px 12px 0 var(--border)">
      <span style="font-size:11px;font-weight:600;display:block">Level 4</span>
      offset(6dp, 6dp)<br>dialog/modal
    </div>
  </div>

  <div class="code-block" style="margin-top:var(--space-xl)">
<span class="cm">// Elevation.kt</span>
<span class="kw">object</span> TrainlyElevation {
    <span class="kw">val</span> level1 = <span class="num">2</span>.dp  <span class="cm">// Flat cards, inputs</span>
    <span class="kw">val</span> level2 = <span class="num">3</span>.dp  <span class="cm">// Default cards, buttons</span>
    <span class="kw">val</span> level3 = <span class="num">4</span>.dp  <span class="cm">// Raised cards, top bar</span>
    <span class="kw">val</span> level4 = <span class="num">6</span>.dp  <span class="cm">// Dialogs, modals</span>
}
  </div>
</section>

<!-- ════════════════════════════════════════════════════════════════ -->
<!-- COMPONENTS                                                     -->
<!-- ════════════════════════════════════════════════════════════════ -->

<!-- ─── Button ─── -->
<section class="section" id="button">
  <div class="section-header">
    <h2>TrainlyButton</h2>
    <span class="file-ref">TrainlyButton.kt</span>
  </div>
  <div class="section-desc">
    Chunky, tactile buttons with offset shadow. Minimum 48dp height per accessibility. Press state flattens the shadow.
    Available in: primary, secondary, outline, ghost, danger, with small/large size variants.
  </div>
  <div class="component-showcase">
    <div class="comp-group">
      <h3>Variants</h3>
      <div class="comp-row">
        <button class="tn-btn primary">Start Workout</button>
        <button class="tn-btn secondary">View History</button>
        <button class="tn-btn outline">Cancel</button>
        <button class="tn-btn ghost">Skip</button>
        <button class="tn-btn danger">Delete</button>
      </div>
    </div>
    <div class="comp-group">
      <h3>Sizes</h3>
      <div class="comp-row">
        <button class="tn-btn primary small">Small</button>
        <button class="tn-btn primary">Default</button>
        <button class="tn-btn primary large">Large CTA</button>
        <button class="tn-btn primary icon-only">→</button>
      </div>
    </div>
    <div class="comp-group">
      <h3>States</h3>
      <div class="comp-row">
        <button class="tn-btn primary">Active</button>
        <button class="tn-btn primary" disabled>Disabled</button>
        <button class="tn-btn primary loading">Saving</button>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyButton.kt — Stateless composable</span>
<span class="cm">// Usage:</span>
<span class="tp">TrainlyButton</span>(
    onClick = { viewModel.startWorkout() },
    variant = TrainlyButtonVariant.Primary,
    size = TrainlyButtonSize.Large,
    enabled = uiState.canStart
) { Text(<span class="str">"Start Workout"</span>) }

<span class="cm">// Modifier chain extracted to TrainlyButtonDefaults.shape()</span>
  </div>
</section>

<!-- ─── Card ─── -->
<section class="section" id="card">
  <div class="section-header">
    <h2>TrainlyCard</h2>
    <span class="file-ref">TrainlyCard.kt</span>
  </div>
  <div class="section-desc">
    Physical, layered cards with offset shadow and thick borders. Default variant for content, interactive for pressable items, accent for highlighted content, and image-card for media layouts.
  </div>
  <div class="component-showcase">
    <div class="comp-row">
      <div class="comp-group" style="max-width:340px">
        <h3>Default Card</h3>
        <div class="tn-card">
          <div class="card-title">Today's Workout</div>
          <div class="card-body">Upper body focus · 45 min · 4 exercises</div>
          <div class="card-footer"><span class="tn-badge accent">In Progress</span></div>
        </div>
      </div>
      <div class="comp-group" style="max-width:340px">
        <h3>Interactive Card</h3>
        <div class="tn-card interactive">
          <div class="card-title">Morning Run</div>
          <div class="card-body">5.2 km · 32 min · 180 cal</div>
          <div class="card-footer"><span>→ View details</span></div>
        </div>
      </div>
    </div>
    <div class="comp-row">
      <div class="comp-group" style="max-width:340px">
        <h3>Accent Card</h3>
        <div class="tn-card accent">
          <div class="card-title">New Personal Best!</div>
          <div class="card-body">You beat your 5K record by 42 seconds. Keep it up!</div>
          <div class="card-footer"><span>→ Share</span></div>
        </div>
      </div>
      <div class="comp-group" style="max-width:340px">
        <h3>Image Card</h3>
        <div class="tn-card image-card">
          <div class="card-img">Route Preview</div>
          <div class="card-content">
            <div class="card-title">Riverside Trail</div>
            <div class="card-body">6.8 km · Moderate</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyCard.kt — Stateless, hoists content slots</span>
<span class="tp">TrainlyCard</span>(
    variant = CardVariant.Default,
    interactive = <span class="kw">true</span>,
    onClick = { navController.navigate(<span class="str">"workout/42"</span>) }
) {
    Text(<span class="str">"Morning Run"</span>, style = TrainlyTypography.titleLarge)
    Text(<span class="str">"5.2 km · 32 min"</span>, style = TrainlyTypography.bodyLarge)
}
  </div>
</section>

<!-- ─── Input ─── -->
<section class="section" id="input">
  <div class="section-header">
    <h2>TrainlyInput</h2>
    <span class="file-ref">TrainlyInput.kt</span>
  </div>
  <div class="section-desc">
    Chunky inputs with thick border and offset shadow. Focus state inverts to primary yellow background. Supports text, email, password, textarea, with error and hint states.
  </div>
  <div class="comp-row">
    <div class="comp-group" style="max-width:400px">
      <h3>Input States</h3>
      <div class="tn-input-wrap">
        <span class="label">Email</span>
        <input class="tn-input" type="email" placeholder="you@example.com" value="alex@trainly.app">
      </div>
      <div class="tn-input-wrap" style="margin-top:var(--space-lg)">
        <span class="label">Password</span>
        <input class="tn-input" type="password" placeholder="Enter password">
        <span class="hint">At least 8 characters</span>
      </div>
      <div class="tn-input-wrap" style="margin-top:var(--space-lg)">
        <span class="label">Weight (kg)</span>
        <input class="tn-input error" type="text" value="abc">
        <span class="error-text">Please enter a valid number</span>
      </div>
      <div class="tn-input-wrap" style="margin-top:var(--space-lg)">
        <span class="label">Notes</span>
        <textarea class="tn-input" placeholder="How did this workout feel?"></textarea>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyInput.kt</span>
<span class="tp">TrainlyInput</span>(
    value = email,
    onValueChange = onEmailChange,
    label = <span class="str">"Email"</span>,
    placeholder = <span class="str">"you@example.com"</span>,
    isError = hasError,
    errorMessage = errorMessage
)
  </div>
</section>

<!-- ─── Top Bar ─── -->
<section class="section" id="topbar">
  <div class="section-header">
    <h2>TrainlyTopBar</h2>
    <span class="file-ref">TrainlyTopBar.kt</span>
  </div>
  <div class="section-desc">
    Structural top bar with back button, title, and action slots. Bold bottom border anchors the screen content.
  </div>
  <div class="comp-row">
    <div class="comp-group" style="max-width:500px">
      <div class="tn-topbar">
        <div class="back">←</div>
        <div class="title">Workout Details</div>
        <div class="actions">
          <div class="tn-chip" style="font-size:11px;padding:2px 8px">Edit</div>
          <div class="tn-chip" style="font-size:11px;padding:2px 8px">⋯</div>
        </div>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyTopBar.kt</span>
<span class="tp">TrainlyTopBar</span>(
    title = <span class="str">"Workout Details"</span>,
    onBack = { navController.popBackStack() },
    actions = {
        TrainlyChip(onClick = { viewModel.editWorkout() }) { Text(<span class="str">"Edit"</span>) }
    }
)
  </div>
</section>

<!-- ─── Bottom Navigation ─── -->
<section class="section" id="bottombar">
  <div class="section-header">
    <h2>TrainlyBottomBar</h2>
    <span class="file-ref">TrainlyBottomBar.kt</span>
  </div>
  <div class="section-desc">
    Five-item bottom navigation bar. Active item gets accent highlight behind the icon. All touch targets ≥ 48dp.
  </div>
  <div class="comp-row">
    <div class="comp-group" style="max-width:500px;padding:0">
      <div class="tn-bottom-nav">
        <button class="nav-item active"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg></div>Home</button>
        <button class="nav-item"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 20h16M4 20l4-8m-4 8l-1-4m17 4l-5-12m5 12l1-2M9 20l3-8m-3 8l-1-3m7 3l2-6"/></svg></div>Stats</button>
        <button class="nav-item"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div>Feed</button>
        <button class="nav-item"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 15l-2 5 2-1 2 1-2-5z"/><path d="M12 3L9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5L12 3z"/></svg></div>Achieve</button>
        <button class="nav-item"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>Profile</button>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyBottomBar.kt — State hoisted from NavController</span>
<span class="tp">TrainlyBottomBar</span>(
    items = BottomNavItems,
    currentRoute = currentRoute,
    onNavigate = { navController.navigate(it.route) }
)
  </div>
</section>

<!-- ─── Scaffold ─── -->
<section class="section" id="scaffold">
  <div class="section-header">
    <h2>TrainlyScaffold</h2>
    <span class="file-ref">TrainlyScaffold.kt</span>
  </div>
  <div class="section-desc">
    Opinionated screen wrapper that composes TrainlyTopBar + content + TrainlyBottomBar.
    Manages safe area, snackbar slot, and consistent border rhythm.
  </div>
  <div class="demo-row">
    <div class="scaffold-preview">
      <div class="tn-topbar">
        <div class="back">←</div>
        <div class="title">Dashboard</div>
        <div class="actions"><div class="tn-chip" style="font-size:11px;padding:2px 8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></div></div>
      </div>
      <div class="sp-body">
        <div class="sp-card">Today's Workout — Upper Body</div>
        <div class="sp-card">Weekly Progress — 4/5 sessions</div>
        <div class="sp-card">Upcoming — Rest day tomorrow</div>
        <div class="sp-card">Friend Activity — 3 active now</div>
      </div>
      <div class="tn-bottom-nav">
        <button class="nav-item active"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg></div>Home</button>
        <button class="nav-item"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 20h16M4 20l4-8m-4 8l-1-4m17 4l-5-12m5 12l1-2M9 20l3-8m-3 8l-1-3m7 3l2-6"/></svg></div>Stats</button>
        <button class="nav-item"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div>Feed</button>
        <button class="nav-item"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 15l-2 5 2-1 2 1-2-5z"/><path d="M12 3L9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5L12 3z"/></svg></div>Achieve</button>
        <button class="nav-item"><div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>Profile</button>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyScaffold.kt</span>
<span class="tp">TrainlyScaffold</span>(
    topBar = { TrainlyTopBar(title = <span class="str">"Dashboard"</span>) },
    bottomBar = { TrainlyBottomBar(items = ..., currentRoute = ...) },
    snackbarHost = snackbarHostState
) { paddingValues <span class="cm">-></span>
    <span class="cm">// Screen content with paddingValues</span>
}
  </div>
</section>

<!-- ─── Dialog ─── -->
<section class="section" id="dialog">
  <div class="section-header">
    <h2>TrainlyDialog</h2>
    <span class="file-ref">TrainlyDialog.kt</span>
  </div>
  <div class="section-desc">
    Hard-edged dialog with maximum offset shadow (level 4). Suitable for confirmations, alerts, and input prompts.
    No backdrop blur — uses solid overlay.
  </div>
  <div class="comp-row">
    <div class="comp-group" style="position:relative;min-height:320px;overflow:hidden">
      <h3>Dialog Preview <span class="kt" style="font-weight:400">(simulated overlay)</span></h3>
      <div style="position:relative;z-index:0">
        <div class="scaffold-preview" style="max-width:100%;min-height:200px;filter:brightness(.7);pointer-events:none">
          <div class="tn-topbar"><div class="title">Workout</div></div>
          <div class="sp-body"><div class="sp-card">Current session…</div></div>
        </div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:var(--space-md)">
          <div class="tn-dialog" style="position:relative;z-index:1">
            <div class="dialog-title">End Workout?</div>
            <div class="dialog-text">You've completed 32 minutes. Save this session before closing?</div>
            <div class="dialog-actions">
              <button class="tn-btn outline small">Discard</button>
              <button class="tn-btn primary small">Save &amp; End</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyDialog.kt</span>
<span class="tp">TrainlyDialog</span>(
    title = <span class="str">"End Workout?"</span>,
    text = <span class="str">"You've completed 32 minutes. Save this session before closing?"</span>,
    confirmLabel = <span class="str">"Save &amp; End"</span>,
    onConfirm = { viewModel.saveAndEnd() },
    dismissLabel = <span class="str">"Discard"</span>,
    onDismiss = { viewModel.discardSession() }
)
  </div>
</section>

<!-- ─── Chip ─── -->
<section class="section" id="chip">
  <div class="section-header">
    <h2>TrainlyChip</h2>
    <span class="file-ref">TrainlyChip.kt</span>
  </div>
  <div class="section-desc">
    Small pill-like filters and tags. Mini offset shadow. Supports selected/unselected, removable (with close button), and secondary variant for dark backgrounds.
  </div>
  <div class="comp-row">
    <div class="comp-group">
      <h3>Chip Variants</h3>
      <div class="comp-row">
        <div class="tn-chip">All</div>
        <div class="tn-chip selected">Running</div>
        <div class="tn-chip">Cycling</div>
        <div class="tn-chip">Strength</div>
        <div class="tn-chip">Yoga</div>
      </div>
      <div class="comp-row" style="margin-top:var(--space-lg)">
        <div class="tn-chip">Upper Body</div>
        <div class="tn-chip selected">Lower Body</div>
        <div class="tn-chip">Full Body</div>
      </div>
    </div>
    <div class="comp-group">
      <h3>Removable &amp; Themed</h3>
      <div class="comp-row">
        <div class="tn-chip selected">Filters (3) <span class="close">×</span></div>
        <div class="tn-chip">Strength <span class="close">×</span></div>
        <div class="tn-chip secondary">Premium</div>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyChip.kt</span>
<span class="tp">TrainlyChip</span>(
    selected = filter == <span class="str">"running"</span>,
    onClick = { onFilterChanged(<span class="str">"running"</span>) },
    removable = <span class="kw">false</span>
) { Text(<span class="str">"Running"</span>) }
  </div>
</section>

<!-- ─── Badge ─── -->
<section class="section" id="badge">
  <div class="section-header">
    <h2>TrainlyBadge</h2>
    <span class="file-ref">TrainlyBadge.kt</span>
  </div>
  <div class="section-desc">
    Compact status and label indicators. Uppercase, bold, with small border. Available in all semantic colors plus outline variant.
  </div>
  <div class="comp-row">
    <div class="comp-group">
      <h3>Badge Variants</h3>
      <div class="comp-row">
        <span class="tn-badge accent">Pro</span>
        <span class="tn-badge secondary">New</span>
        <span class="tn-badge success">Completed</span>
        <span class="tn-badge warning">Pending</span>
        <span class="tn-badge danger">Expired</span>
        <span class="tn-badge outline">Draft</span>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyBadge.kt</span>
<span class="tp">TrainlyBadge</span>(
    text = <span class="str">"Completed"</span>,
    variant = BadgeVariant.Success
)
  </div>
</section>

<!-- ─── Empty State ─── -->
<section class="section" id="emptystate">
  <div class="section-header">
    <h2>TrainlyEmptyState</h2>
    <span class="file-ref">TrainlyEmptyState.kt</span>
  </div>
  <div class="section-desc">
    Bold empty state with thick border, icon box, and action slot. No illustrations — the icon + message do the work.
  </div>
  <div class="comp-row">
    <div class="comp-group" style="max-width:420px">
      <div class="tn-empty">
        <div class="empty-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        <div class="empty-title">No Workouts Yet</div>
        <div class="empty-text">Start your first session to see your activity here. Your journey begins with a single step.</div>
        <button class="tn-btn primary">Start Your First Workout</button>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyEmptyState.kt</span>
<span class="tp">TrainlyEmptyState</span>(
    icon = @Composable { TrainlyIcon(icon = Icons.EmptyWorkout) },
    title = <span class="str">"No Workouts Yet"</span>,
    message = <span class="str">"Start your first session to see your activity here."</span>,
    action = {
        TrainlyButton(onClick = { navController.navigate(<span class="str">"workout/new"</span>) }) {
            Text(<span class="str">"Start Your First Workout"</span>)
        }
    }
)
  </div>
</section>

<!-- ─── Loading ─── -->
<section class="section" id="loading">
  <div class="section-header">
    <h2>TrainlyLoading</h2>
    <span class="file-ref">TrainlyLoading.kt</span>
  </div>
  <div class="section-desc">
    Bold spinner with thick border and accent top color. Available in fullscreen and inline variants.
  </div>
  <div class="comp-row">
    <div class="comp-group">
      <h3>Fullscreen</h3>
      <div class="tn-loading fullscreen" style="border:3px solid var(--border)">
        <div class="spinner"></div>
        <div class="load-text">Loading your data…</div>
      </div>
    </div>
    <div class="comp-group">
      <h3>Inline</h3>
      <div class="tn-loading inline">
        <div class="spinner"></div>
        <div class="load-text">Syncing</div>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="cm">// TrainlyLoading.kt</span>
<span class="tp">TrainlyLoading</span>(
    modifier = Modifier.fillMaxSize(),
    variant = LoadingVariant.Fullscreen,
    label = <span class="str">"Loading your data…"</span>
)

<span class="cm">// Inline variant for existing content</span>
<span class="tp">TrainlyLoading</span>(
    variant = LoadingVariant.Inline,
    label = <span class="str">"Syncing"</span>
)
  </div>
</section>

<!-- ─── Architecture Summary ─── -->
<section class="section" id="architecture" style="border-bottom:none">
  <div class="section-header">
    <h2>Architecture &amp; File Map</h2>
    <span class="file-ref">Theme.kt · NeoBrutalTokens.kt</span>
  </div>
  <div class="section-desc">
    Theme tokens live in <code>theme/</code>. Components live in <code>ui/components/core/</code>. The Theme composable merges all token objects into a single MaterialTheme wrapper.
  </div>

  <div class="code-block">
<span class="cm">// Theme.kt — Entry point</span>
<span class="tp">TrainlyTheme</span>(
    darkTheme = isDark,
    content = <span class="cm">@Composable</span> { <span class="cm">-></span>
        <span class="tp">MaterialTheme</span>(
            colorScheme = if (darkTheme) TrainlyDarkColors else TrainlyLightColors,
            typography = TrainlyTypography,
            shapes = TrainlyShapes,
            content = content
        )
    }
)
  </div>

  <div style="margin-top:var(--space-xl)">
    <div class="token-grid wide">
      <div class="token-card">
        <div class="info"><div class="name">theme/Color.kt</div><div class="value">All color tokens + light/dark schemes</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/Typography.kt</div><div class="value">Inter + JetBrains Mono, 6-step scale</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/Shapes.kt</div><div class="value">RoundedCornerShape presets (0–8dp)</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/Spacing.kt</div><div class="value">6-step spacing scale (4–32dp)</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/Borders.kt</div><div class="value">Border width tokens (2–4dp)</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/Shadows.kt</div><div class="value">Hard offset shadow definitions</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/Elevation.kt</div><div class="value">4-level elevation system</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/Dimensions.kt</div><div class="value">Component size constants (header, nav, min touch)</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/NeoBrutalTokens.kt</div><div class="value">Central token registry, all objects aggregated</div></div>
      </div>
      <div class="token-card">
        <div class="info"><div class="name">theme/Theme.kt</div><div class="value">TrainlyTheme composable wrapper</div></div>
      </div>
    </div>
  </div>

  <div style="margin-top:var(--space-xl)">
    <div class="section-header"><h3 style="font-size:17px;font-weight:800">Component File Map</h3></div>
    <div class="token-grid wide">
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyButton.kt</div><div class="value">5 variants, 3 sizes, loading + disabled states</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyCard.kt</div><div class="value">4 variants: default, interactive, accent, image</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyInput.kt</div><div class="value">Text, password, textarea with error/hint states</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyTopBar.kt</div><div class="value">Back + title + actions slots</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyBottomBar.kt</div><div class="value">5-item nav, active state highlight</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyScaffold.kt</div><div class="value">Composes TopBar + content + BottomBar</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyDialog.kt</div><div class="value">Confirm/dismiss dialog with level-4 shadow</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyChip.kt</div><div class="value">Filter chips, selected state, removable variant</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyBadge.kt</div><div class="value">Status badges in all semantic colors</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyEmptyState.kt</div><div class="value">Icon + title + message + action slot</div></div></div>
      <div class="token-card"><div class="info"><div class="name">ui/components/core/TrainlyLoading.kt</div><div class="value">Fullscreen + inline spinner variants</div></div></div>
    </div>
  </div>
</section>

<footer style="padding:var(--space-xl);border-top:4px solid var(--border);font-size:13px;color:var(--muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:var(--space-md)">
  <span>Trainly — Neo-Brutalist Design System</span>
  <span>Phase 1 · Theme Tokens + Core Components</span>
</footer>

</div>
</div>
</body>
</html>
