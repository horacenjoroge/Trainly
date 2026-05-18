<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trainly — UX Architecture</title>
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
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font-body);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
.layout{display:flex;min-height:100vh}
.sidebar{width:260px;flex-shrink:0;background:var(--surface);border-right:4px solid var(--border);padding:var(--space-xl);position:sticky;top:0;height:100vh;overflow-y:auto}
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
.card{border:var(--border-w) solid var(--border);background:var(--surface);padding:var(--space-xl);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);display:flex;flex-direction:column;gap:var(--space-md)}
.card.accent-header{border-top-width:6px;border-top-color:var(--accent)}
.card h3{font-weight:800;font-size:17px;letter-spacing:-0.01em}
.card p{font-size:15px;color:var(--muted);line-height:1.5}
.grid-2{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-xl)}
.grid-3{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--space-lg)}
.badge{display:inline-flex;align-items:center;padding:2px var(--space-sm);font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border:2px solid var(--border);line-height:1.2}
.badge.accent{background:var(--accent);color:var(--fg)}
.badge.secondary{background:var(--secondary);color:#fff}
.badge.success{background:var(--success);color:#fff}
.badge.warning{background:var(--warning);color:#fff}
.badge.danger{background:var(--danger);color:#fff}
.badge.outline{background:transparent;color:var(--fg)}
.badge.sm{font-size:10px;padding:1px 6px}
.tag{display:inline-block;background:var(--accent);color:var(--fg);padding:var(--space-xs) var(--space-md);font-weight:700;font-size:13px;border:3px solid var(--border);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);margin-right:var(--space-sm);margin-bottom:var(--space-sm)}
.diagram{border:var(--border-w) solid var(--border);background:var(--surface);padding:var(--space-xl);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);margin:var(--space-lg) 0;overflow-x:auto}
.diagram pre{font-family:var(--font-mono);font-size:13px;line-height:1.8;white-space:pre}
.route-item{display:flex;align-items:baseline;gap:var(--space-md);padding:var(--space-sm) 0;border-bottom:2px solid var(--border);font-family:var(--font-mono);font-size:13px}
.route-item:last-child{border-bottom:none}
.route-item .dot{width:10px;height:10px;border:2px solid var(--border);flex-shrink:0;background:var(--accent);transform:rotate(45deg)}
.route-item .route-path{font-weight:600;color:var(--fg)}
.route-item .route-desc{color:var(--muted);font-family:var(--font-body);font-size:13px;flex:1;text-align:right}
.flow-row{display:flex;align-items:center;gap:var(--space-sm);flex-wrap:wrap;padding:var(--space-sm) 0;font-size:13px;font-weight:600}
.flow-row .step{display:flex;align-items:center;gap:var(--space-xs);padding:var(--space-xs) var(--space-sm);border:2px solid var(--border);background:var(--surface)}
.flow-row .arrow{font-weight:700;color:var(--muted)}
.family-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--space-md)}
.family-item{border:var(--border-w) solid var(--border);padding:var(--space-lg);background:var(--surface);transform:translate(-1px,-1px);box-shadow:3px 3px 0 var(--border);text-align:center}
.family-item .f-icon{width:36px;height:36px;margin:0 auto var(--space-sm);display:flex;align-items:center;justify-content:center;border:2px solid var(--border);background:var(--accent);font-size:18px;font-weight:900}
.family-item .f-name{font-weight:800;font-size:14px;margin-bottom:2px}
.family-item .f-count{font-size:12px;color:var(--muted)}
.priority-list{display:flex;flex-direction:column;gap:var(--space-lg)}
.priority-item{border:var(--border-w) solid var(--border);padding:var(--space-lg);background:var(--surface);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);display:flex;align-items:flex-start;gap:var(--space-lg)}
.priority-item .p-num{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:3px solid var(--border);background:var(--accent);font-weight:900;font-size:17px;flex-shrink:0}
.priority-item .p-content{flex:1}
.priority-item .p-title{font-weight:800;font-size:17px;margin-bottom:var(--space-xs)}
.priority-item .p-desc{font-size:14px;color:var(--muted);line-height:1.5}
.state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-lg)}
.state-card{border:2px solid var(--border);padding:var(--space-lg);background:var(--surface);text-align:center}
.state-card .s-icon{font-size:28px;font-weight:900;margin-bottom:var(--space-sm)}
.state-card .s-name{font-weight:800;font-size:14px;margin-bottom:var(--space-xs)}
.state-card .s-desc{font-size:12px;color:var(--muted);line-height:1.4}
.rule-list{display:flex;flex-direction:column;gap:var(--space-md)}
.rule-item{display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);border:2px solid var(--border);background:var(--surface);font-size:14px}
.rule-item .r-icon{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid var(--border);font-weight:900;font-size:14px;flex-shrink:0;background:var(--accent)}
.flow-table{width:100%;border-collapse:collapse;font-size:14px;margin:var(--space-lg) 0}
.flow-table th{text-align:left;padding:var(--space-sm) var(--space-md);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:3px solid var(--border);background:var(--surface);color:var(--muted)}
.flow-table td{padding:var(--space-sm) var(--space-md);border-bottom:2px solid var(--border);vertical-align:top}
.flow-table tr:last-child td{border-bottom:none}
.flow-table .highlight{background:var(--accent);font-weight:700;padding:1px 6px;border:2px solid var(--border);font-size:11px}
.phone-frame{max-width:390px;border:var(--border-w) solid var(--border);background:var(--surface);overflow:hidden;margin:var(--space-lg) 0}
.phone-frame .pf-top{display:flex;align-items:center;padding:var(--space-sm) var(--space-md);border-bottom:var(--border-w) solid var(--border);font-weight:800;font-size:15px;gap:var(--space-sm);background:var(--surface)}
.phone-frame .pf-body{padding:var(--space-lg);display:flex;flex-direction:column;gap:var(--space-md);min-height:200px}
.phone-frame .pf-bottom{display:flex;border-top:var(--border-w) solid var(--border)}
.phone-frame .pf-bottom .pf-item{flex:1;text-align:center;padding:var(--space-sm);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);border-right:2px solid var(--border)}
.phone-frame .pf-bottom .pf-item:last-child{border-right:none}
.phone-frame .pf-bottom .pf-item.active{color:var(--fg);background:var(--accent)}
.shell-diagram{display:flex;flex-direction:column;gap:0;border:var(--border-w) solid var(--border);margin:var(--space-lg) 0;transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border)}
.shell-diagram .sd-top{display:flex;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--surface);border-bottom:3px solid var(--border);gap:var(--space-md)}
.shell-diagram .sd-top .sd-back{width:32px;height:32px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.shell-diagram .sd-top .sd-title{font-weight:800;font-size:15px;flex:1}
.shell-diagram .sd-top .sd-action{font-size:11px;font-weight:700;border:2px solid var(--border);padding:2px 8px}
.shell-diagram .sd-body{padding:var(--space-lg);background:var(--bg);min-height:160px;display:flex;flex-direction:column;gap:var(--space-md)}
.shell-diagram .sd-body .sd-card{height:44px;border:2px solid var(--border);display:flex;align-items:center;padding:var(--space-sm) var(--space-md);font-weight:600;font-size:13px;background:var(--surface)}
.shell-diagram .sd-bottom{display:flex;border-top:3px solid var(--border);background:var(--surface)}
.shell-diagram .sd-bottom .sd-nav{flex:1;text-align:center;padding:var(--space-sm);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);border-right:2px solid var(--border)}
.shell-diagram .sd-bottom .sd-nav:last-child{border-right:none}
.shell-diagram .sd-bottom .sd-nav.active{color:var(--fg);background:var(--accent)}
.code-block{background:#1C293C;color:#E5E7EB;padding:var(--space-lg);font-family:var(--font-mono);font-size:13px;line-height:1.6;overflow-x:auto;border:var(--border-w) solid var(--border);transform:translate(-2px,-2px);box-shadow:4px 4px 0 var(--border);margin-top:var(--space-lg)}
.code-block .kw{color:#FDC800}
.code-block .str{color:#16A34A}
.code-block .cm{color:#6B7280;font-style:italic}
.code-block .tp{color:#93C5FD}
.code-block .fn{color:#A78BFA}
.code-block .num{color:#FDBA74}
@media(max-width:768px){
  .sidebar{display:none}
  .hero{padding:var(--space-xl) var(--space-lg)}
  .section{padding:var(--space-xl) var(--space-lg)}
  .grid-2{grid-template-columns:1fr}
  .grid-3{grid-template-columns:1fr 1fr}
  .priority-item{flex-direction:column;gap:var(--space-md)}
}
</style>
</head>
<body>
<div class="layout">
<aside class="sidebar">
  <div class="logo"><span></span> Trainly</div>
  <div class="nav-label">Architecture</div>
  <nav>
    <a href="#navarch">Navigation Architecture</a>
    <a href="#shell">App Shell System</a>
    <a href="#families">Screen Families</a>
    <a href="#interactions">Interaction Rules</a>
    <a href="#states">State Design</a>
    <a href="#motion">Motion &amp; Animation</a>
  </nav>
  <div class="nav-label">Families</div>
  <nav>
    <a href="#family-auth">Auth</a>
    <a href="#family-home">Home / Dashboard</a>
    <a href="#family-training">Training</a>
    <a href="#family-workout">Workout History</a>
    <a href="#family-social">Social</a>
    <a href="#family-profile">Profile</a>
    <a href="#family-analytics">Analytics</a>
    <a href="#family-emergency">Emergency</a>
  </nav>
  <div class="nav-label">Implementation</div>
  <nav>
    <a href="#phases">Phased Execution</a>
    <a href="#priorities">Priority Map</a>
  </nav>
</aside>

<div class="main">
<section class="hero">
  <h1>UX Architecture<br>&amp; Screen System</h1>
  <p>Navigation architecture, app shell system, screen family redesign, interaction rules, and state design for the Trainly neo-brutalist redesign. 27 production screens across 7 feature domains.</p>
  <div class="meta-row">
    <span>→ 27 screens</span>
    <span>→ 7 feature domains</span>
    <span>→ 5 bottom nav tabs</span>
    <span>→ 8 nested graphs</span>
    <span>→ Phase 1–5 execution</span>
  </div>
</section>

<!-- ════════════════════════════════════════════════════════ -->
<!-- NAVIGATION ARCHITECTURE                                  -->
<!-- ════════════════════════════════════════════════════════ -->
<section class="section" id="navarch">
<div class="section-header">
  <h2>Navigation Architecture</h2>
  <span class="file-ref">NavGraph.kt · BottomNavItems.kt</span>
</div>
<div class="section-desc">
  Restructured from a monolithic NavGraph into 8 nested graphs with clear ownership.
  Bottom navigation anchors the primary app shell; secondary flows use push navigation.
  Emergency SOS is globally accessible from any screen via a system-level overlay.
</div>

<h3 class="section-sub">Bottom Navigation</h3>
<p style="margin-bottom:var(--space-lg);font-size:15px;color:var(--muted)">Five-tab structure. Each tab owns a nested NavGraph. Tab resets to its start destination on re-selection.</p>

<div class="phone-frame">
  <div class="pf-bottom" style="border-top:3px solid var(--border)">
    <div class="pf-item active">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:block;margin:0 auto 2px"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>
      Home
    </div>
    <div class="pf-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:block;margin:0 auto 2px"><path d="M4 20h16M4 20l4-8m-4 8l-1-4m17 4l-5-12m5 12l1-2M9 20l3-8m-3 8l-1-3m7 3l2-6"/></svg>
      Stats
    </div>
    <div class="pf-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:block;margin:0 auto 2px"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
      Feed
    </div>
    <div class="pf-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:block;margin:0 auto 2px"><path d="M12 15l-2 5 2-1 2 1-2-5z"/><path d="M12 3L9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5L12 3z"/></svg>
      Achieve
    </div>
    <div class="pf-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:block;margin:0 auto 2px"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      Profile
    </div>
  </div>
</div>

<h3 class="section-sub">Nested Navigation Graphs</h3>
<p style="margin-bottom:var(--space-lg);font-size:15px;color:var(--muted)">Each graph owns its routes. Cross-graph navigation happens through a shared NavController with route qualification.</p>

<div class="diagram">
<pre>NavHost(startDestination = "auth")
├── authGraph            ← Splash, Login, Register
├── homeGraph            ← Dashboard (tab 1 start)
├── trainingGraph        ← TrainingSelection, Running, Cycling, Swimming, GymWorkout
├── workoutGraph         ← WorkoutHistory, WorkoutDetail
├── socialGraph          ← CommunityFeed, CreatePost, Comments, UserProfile, FindFriends, Followers, Following
├── statsGraph           ← StatsScreen (tab 2 start)
├── profileGraph         ← Profile (tab 5 start), Settings, PersonalInfo, EditStats
├── emergencyGraph       ← SOS, EmergencyContacts
│
│   ┌─ Tab graph ownership:
│   │   Tab 1 (Home)    → homeGraph
│   │   Tab 2 (Stats)   → statsGraph
│   │   Tab 3 (Feed)    → socialGraph
│   │   Tab 4 (Achieve) → statsGraph (achievements destination)
│   │   Tab 5 (Profile) → profileGraph
│   │
│   └─ Global: emergencyGraph accessible from any screen
</pre>
</div>

<h3 class="section-sub">Route Hierarchy</h3>
<div style="margin-bottom:var(--space-lg)">
  <div class="route-item"><span class="dot"></span><span class="route-path">auth/splash</span><span class="route-desc">Graph: authGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">auth/login</span><span class="route-desc">Graph: authGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">auth/register</span><span class="route-desc">Graph: authGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">home</span><span class="route-desc">Graph: homeGraph · Tab 1 start</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">training</span><span class="route-desc">Graph: trainingGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">training/running</span><span class="route-desc">Graph: trainingGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">training/cycling</span><span class="route-desc">Graph: trainingGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">training/swimming</span><span class="route-desc">Graph: trainingGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">training/gym</span><span class="route-desc">Graph: trainingGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">workout/history</span><span class="route-desc">Graph: workoutGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">workout/{id}</span><span class="route-desc">Graph: workoutGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">stats</span><span class="route-desc">Graph: statsGraph · Tab 2 start</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">stats/achievements</span><span class="route-desc">Graph: statsGraph · Tab 4</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">social/feed</span><span class="route-desc">Graph: socialGraph · Tab 3 start</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">social/post/create</span><span class="route-desc">Graph: socialGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">social/post/{id}/comments</span><span class="route-desc">Graph: socialGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">social/user/{id}</span><span class="route-desc">Graph: socialGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">social/find</span><span class="route-desc">Graph: socialGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">social/followers/{id}</span><span class="route-desc">Graph: socialGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">social/following/{id}</span><span class="route-desc">Graph: socialGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">profile</span><span class="route-desc">Graph: profileGraph · Tab 5 start</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">profile/settings</span><span class="route-desc">Graph: profileGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">profile/info</span><span class="route-desc">Graph: profileGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path">profile/edit-stats</span><span class="route-desc">Graph: profileGraph</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path" style="color:var(--danger)">emergency/sos</span><span class="route-desc">Graph: emergencyGraph · Global overlay</span></div>
  <div class="route-item"><span class="dot"></span><span class="route-path" style="color:var(--danger)">emergency/contacts</span><span class="route-desc">Graph: emergencyGraph · Global overlay</span></div>
</div>

<h3 class="section-sub">Common Flows</h3>
<div class="flow-row"><span class="step">Home</span><span class="arrow">→</span><span class="step">Training Selection</span><span class="arrow">→</span><span class="step">Active Workout</span><span class="arrow">→</span><span class="step">Summary</span><span class="arrow">→</span><span class="step">History</span></div>
<div class="flow-row"><span class="step">Feed</span><span class="arrow">→</span><span class="step">Create Post</span><span class="arrow">→</span><span class="step">Comments</span></div>
<div class="flow-row"><span class="step">Profile</span><span class="arrow">→</span><span class="step">Settings</span><span class="arrow">→</span><span class="step">Personal Info</span></div>
<div class="flow-row"><span class="step">Any Screen</span><span class="arrow">→</span><span class="step" style="background:var(--danger);color:#fff;border-color:var(--danger)">Emergency SOS</span></div>

<h3 class="section-sub">Key Navigation Rules</h3>
<div class="rule-list">
  <div class="rule-item"><span class="r-icon">1</span> Tab re-selection navigates to tab's start destination (no dead-end tabs)</div>
  <div class="rule-item"><span class="r-icon">2</span> Each nested graph has a single start destination</div>
  <div class="rule-item"><span class="r-icon">3</span> Cross-graph navigation uses fully qualified route paths</div>
  <div class="rule-item"><span class="r-icon">4</span> Back always pops the current graph first, then the parent</div>
  <div class="rule-item"><span class="r-icon">5</span> Emergency overlay is a system-level dialog, not a navigation destination</div>
  <div class="rule-item"><span class="r-icon">6</span> Workout save flow returns to history (not requiring extra back press)</div>
</div>

<div class="code-block">
<span class="cm">// NavGraph.kt — Root navigation host</span>
<span class="tp">NavHost</span>(navController, startDestination = <span class="str">"auth"</span>) {
    navigation(startDestination = <span class="str">"splash"</span>, route = <span class="str">"auth"</span>) {
        composable(<span class="str">"splash"</span>) { SplashScreen(navController) }
        composable(<span class="str">"login"</span>) { LoginScreen(navController) }
        composable(<span class="str">"register"</span>) { RegisterScreen(navController) }
    }
    navigation(startDestination = <span class="str">"home"</span>, route = <span class="str">"home_graph"</span>) {
        composable(<span class="str">"home"</span>) { DashboardScreen(viewModel, navController) }
    }
    <span class="cm">// ... trainingGraph, workoutGraph, socialGraph, statsGraph, profileGraph</span>
    <span class="cm">// emergencyGraph is a dialog-based overlay, not a NavHost graph</span>
}
</div>
</section>

<!-- ════════════════════════════════════════════════════════ -->
<!-- APP SHELL SYSTEM                                        -->
<!-- ════════════════════════════════════════════════════════ -->
<section class="section" id="shell">
<div class="section-header">
  <h2>App Shell System</h2>
  <span class="file-ref">TrainlyScaffold.kt · TrainlyTopBar.kt · TrainlyBottomBar.kt</span>
</div>
<div class="section-desc">
  Unified shell system wraps every screen. TrainlyScaffold composes top bar + content + bottom bar +
  snackbar + modal/dialog host. Safe area, border rhythm, and consistent chrome managed centrally.
</div>

<h3 class="section-sub">Scaffold Architecture</h3>
<div class="shell-diagram">
  <div class="sd-top">
    <div class="sd-back">←</div>
    <div class="sd-title">TrainlyScaffold</div>
    <div class="sd-action">TopBar</div>
  </div>
  <div class="sd-body">
    <div class="sd-card">Screen content slot (PaddingValues applied)</div>
    <div class="sd-card" style="opacity:.5">SnackbarHost (global)</div>
    <div class="sd-card" style="opacity:.5">FAB overlay (optional)</div>
  </div>
  <div class="sd-bottom">
    <div class="sd-nav active">Home</div>
    <div class="sd-nav">Stats</div>
    <div class="sd-nav">Feed</div>
    <div class="sd-nav">Achieve</div>
    <div class="sd-nav">Profile</div>
  </div>
</div>

<h3 class="section-sub">Top Bar Variants</h3>
<div class="grid-2">
  <div class="card">
    <h3>Default</h3>
    <p>Standard top bar with back button, title, and action slots. Bold bottom border anchors content.</p>
    <div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) 0;border:2px solid var(--border)">
      <span style="width:32px;height:32px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;margin-left:var(--space-sm)">←</span>
      <span style="font-weight:800;font-size:15px;flex:1">Screen Title</span>
      <span style="font-size:11px;font-weight:700;border:2px solid var(--border);padding:2px 8px;margin-right:var(--space-sm)">Action</span>
    </div>
    <span class="badge outline sm" style="margin-top:var(--space-sm)">scoped: all screens</span>
  </div>
  <div class="card">
    <h3>Workout (Active)</h3>
    <p>Minimal chrome during active exercise. Timer in title area. SOS button always visible.</p>
    <div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) 0;border:2px solid var(--border);background:var(--accent)">
      <span style="font-weight:800;font-size:15px;flex:1;margin-left:var(--space-sm)">32:45</span>
      <span style="font-size:11px;font-weight:700;border:2px solid var(--border);padding:2px 8px;background:var(--danger);color:#fff;margin-right:var(--space-sm)">SOS</span>
    </div>
    <span class="badge outline sm" style="margin-top:var(--space-sm)">scoped: trainingGraph</span>
  </div>
  <div class="card">
    <h3>Social (Search)</h3>
    <p>Back button + search input + create action. Used in feed and discovery screens.</p>
    <div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) 0;border:2px solid var(--border)">
      <span style="width:32px;height:32px;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;margin-left:var(--space-sm)">←</span>
      <span style="flex:1;border:2px solid var(--border);padding:4px 8px;font-size:13px;color:var(--muted)">Search people...</span>
      <span style="font-size:18px;font-weight:700;margin-right:var(--space-sm)">+</span>
    </div>
    <span class="badge outline sm" style="margin-top:var(--space-sm)">scoped: socialGraph</span>
  </div>
  <div class="card">
    <h3>Emergency</h3>
    <p>Red background, large SOS text, minimal chrome. Used in emergency flows only.</p>
    <div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) 0;border:2px solid var(--border);background:var(--danger)">
      <span style="font-weight:900;font-size:17px;flex:1;margin-left:var(--space-sm);color:#fff">Emergency</span>
      <span style="font-size:11px;font-weight:700;border:2px solid var(--border);padding:2px 8px;background:#fff;color:var(--danger);margin-right:var(--space-sm)">Close</span>
    </div>
    <span class="badge outline sm" style="margin-top:var(--space-sm)">scoped: emergencyGraph</span>
  </div>
</div>

<h3 class="section-sub">Bottom Navigation Items</h3>
<table class="flow-table">
  <tr><th>Tab</th><th>Icon</th><th>Route</th><th>Graph</th><th>Behavior</th></tr>
  <tr><td><span class="tag" style="font-size:11px;padding:2px 8px">1</span> Home</td><td>Home icon</td><td>home</td><td>homeGraph</td><td>Start destination · Resets to home on re-tap</td></tr>
  <tr><td><span class="tag" style="font-size:11px;padding:2px 8px">2</span> Stats</td><td>Bar chart</td><td>stats</td><td>statsGraph</td><td>Start destination · Month/Week/Year picker</td></tr>
  <tr><td><span class="tag" style="font-size:11px;padding:2px 8px">3</span> Feed</td><td>People</td><td>social/feed</td><td>socialGraph</td><td>Start destination · Lazy feed with refresh</td></tr>
  <tr><td><span class="tag" style="font-size:11px;padding:2px 8px">4</span> Achieve</td><td>Star/badge</td><td>stats/achievements</td><td>statsGraph</td><td>Non-start destination · Pushes onto stats graph</td></tr>
  <tr><td><span class="tag" style="font-size:11px;padding:2px 8px">5</span> Profile</td><td>User</td><td>profile</td><td>profileGraph</td><td>Start destination · Avatar + stats + settings</td></tr>
</table>

<h3 class="section-sub">Shell State Management</h3>
<div class="code-block">
<span class="cm">// TrainlyScaffold.kt — Unified app shell</span>
<span class="tp">TrainlyScaffold</span>(
    topBarVariant = TopBarVariant.Default(<span class="str">"Dashboard"</span>),
    bottomBar = BottomNavConfig(
        items = BottomNavItems,
        currentRoute = currentRoute,
        onTabSelected = { navController.navigateToTab(it) }
    ),
    snackbarHostState = snackbarHostState,
    fab = {
        <span class="tp">TrainlyButton</span>(
            onClick = { navController.navigate(<span class="str">"training"</span>) },
            variant = TrainlyButtonVariant.Primary,
            modifier = Modifier.size(56.dp)
        ) { Icon(Icons.Default.Add, contentDescription = <span class="str">"Start workout"</span>) }
    }
) { innerPadding <span class="cm">-></span>
    ScreenContent(Modifier.padding(innerPadding))
}
</div>
</section>

<!-- ════════════════════════════════════════════════════════ -->
<!-- SCREEN FAMILIES                                         -->
<!-- ════════════════════════════════════════════════════════ -->
<section class="section" id="families">
<div class="section-header">
  <h2>Screen Families</h2>
  <span class="file-ref">layouts/ · screens/</span>
</div>
<div class="section-desc">
  Screens are redesigned in families, not individually. Each family shares layout archetypes,
  interaction patterns, and state handling. Primitives from the design system are composed
  consistently across every screen in the family.
</div>

<!-- Auth Family -->
<h3 class="section-sub" id="family-auth" style="border-bottom:3px solid var(--accent);padding-bottom:var(--space-sm)">Auth Family</h3>
<div class="grid-3">
  <div class="card">
    <span class="badge accent" style="margin-bottom:var(--space-sm)">Splash</span>
    <h3>Splash Screen</h3>
    <p>Brand splash with app logo, tagline, and auto-navigation to login or home based on auth state.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Animated logo reveal</div>
      <div>→ Auto-route after 1.5s</div>
      <div>→ States: loading, auth-check, offline</div>
    </div>
  </div>
  <div class="card">
    <span class="badge accent" style="margin-bottom:var(--space-sm)">Login</span>
    <h3>Login Screen</h3>
    <p>Email + password form. Social login options. Bold CTA with offset shadow.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ TrainlyInput × 2 (email, password)</div>
      <div>→ TrainlyButton (primary, large, full-width)</div>
      <div>→ States: idle, loading, error, offline</div>
    </div>
  </div>
  <div class="card">
    <span class="badge accent" style="margin-bottom:var(--space-sm)">Register</span>
    <h3>Register Screen</h3>
    <p>Multi-step registration. Name, email, password, fitness profile. Progress indicator.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Step indicator (TrainlyChip group)</div>
      <div>→ Form fields per step</div>
      <div>→ States: idle, validating, submitting, error</div>
    </div>
  </div>
</div>

<!-- Home Family -->
<h3 class="section-sub" id="family-home" style="margin-top:var(--space-2xl);border-bottom:3px solid var(--accent);padding-bottom:var(--space-sm)">Home / Dashboard Family</h3>
<div class="grid-3">
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Dashboard</span>
    <h3>Home / Dashboard</h3>
    <p>Today's summary: workout streak, quick-start training cards, recent activity, friend activity.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ TrainlyCard (interactive) for quick-start</div>
      <div>→ Stat rows for daily metrics</div>
      <div>→ States: loaded, empty (no workouts yet), offline</div>
    </div>
  </div>
</div>

<!-- Training Family -->
<h3 class="section-sub" id="family-training" style="margin-top:var(--space-2xl);border-bottom:3px solid var(--accent);padding-bottom:var(--space-sm)">Training Family</h3>
<div class="grid-3">
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Selection</span>
    <h3>Training Selection</h3>
    <p>Grid of workout types with filter chips. Each type navigates to its active screen.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ TrainlyChip row for category filter</div>
      <div>→ TrainlyCard (interactive, image variant) per type</div>
      <div>→ States: loaded, empty, loading</div>
    </div>
  </div>
  <div class="card">
    <span class="badge danger" style="margin-bottom:var(--space-sm)">Active</span>
    <h3>Running / Cycling / Swimming / Gym</h3>
    <p>Active workout screens share a common layout: large timer/metric, minimal chrome, SOS access. Each sport has sport-specific controls (pace, cadence, lap count, set tracking).</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Shared ActiveWorkout composable</div>
      <div>→ Large metric display (36sp)</div>
      <div>→ Sport-specific control panel</div>
      <div>→ SOS button always visible</div>
      <div>→ States: active, paused, completed, GPS-lost</div>
    </div>
  </div>
  <div class="card">
    <span class="badge success" style="margin-bottom:var(--space-sm)">Summary</span>
    <h3>Workout Summary</h3>
    <p>Post-workout summary with key metrics, route map, achievements earned, and share CTA.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Stat rows (duration, distance, calories, pace)</div>
      <div>→ Map preview card</div>
      <div>→ TrainlyBadge for achievements</div>
      <div>→ States: loaded, error (save failed)</div>
    </div>
  </div>
</div>

<!-- Workout History Family -->
<h3 class="section-sub" id="family-workout" style="margin-top:var(--space-2xl);border-bottom:3px solid var(--accent);padding-bottom:var(--space-sm)">Workout History Family</h3>
<div class="grid-3">
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">History</span>
    <h3>Workout History</h3>
    <p>Filterable lazy list of past workouts. Month headers, search, type filter chips.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ TrainlyChip row for type filter</div>
      <div>→ LazyColumn with TrainlyCard (interactive) per item</div>
      <div>→ Pull-to-refresh</div>
      <div>→ States: loading, loaded, empty, error, offline</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Detail</span>
    <h3>Workout Detail</h3>
    <p>Full workout breakdown: metrics, split/segment timeline, route map, elevation chart, notes.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Stat row section</div>
      <div>→ Segment list (time, distance, pace)</div>
      <div>→ Map card</div>
      <div>→ Elevation chart placeholder</div>
      <div>→ States: loading, loaded, error, offline</div>
    </div>
  </div>
</div>

<!-- Social Family -->
<h3 class="section-sub" id="family-social" style="margin-top:var(--space-2xl);border-bottom:3px solid var(--accent);padding-bottom:var(--space-sm)">Social Family</h3>
<div class="grid-3">
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Feed</span>
    <h3>Community Feed</h3>
    <p>Lazy column of friend workout posts. Each item: avatar, name, workout summary, stats, engagement.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ TrainlyCard with UserRow composable</div>
      <div>→ LazyColumn with Paging 3</div>
      <div>→ Like, comment, share actions</div>
      <div>→ States: loading, loaded, empty, error, offline</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Create</span>
    <h3>Create Post</h3>
    <p>Rich text input + optional workout attachment + image picker. Post CTA.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ TrainlyInput (multiline)</div>
      <div>→ Workout attachment card</div>
      <div>→ Image picker grid</div>
      <div>→ States: drafting, posting, error</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Comments</span>
    <h3>Comments Screen</h3>
    <p>Threaded comments below a post. Inline reply. TrainlyCard for each comment.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ LazyColumn with TrainlyCard per comment</div>
      <div>→ TrainlyInput + send button at bottom</div>
      <div>→ States: loading, loaded, empty, error</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Profile</span>
    <h3>User Profile (Other)</h3>
    <p>View another user's profile: header, stats row, recent activity feed, follow/unfollow.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Avatar + name + bio header</div>
      <div>→ Metric stat row</div>
      <div>→ TrainlyButton (follow/unfollow)</div>
      <div>→ States: loading, loaded, error, offline</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Find</span>
    <h3>Find Friends</h3>
    <p>Search users by name/email. Results list with add friend CTA.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Search TrainlyInput</div>
      <div>→ LazyColumn with UserRow</div>
      <div>→ States: searching, results, empty, error</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Follower</span>
    <h3>Followers / Following</h3>
    <p>Lazy list of followers/following for a given user. Mutual badge.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Tab toggle: Followers | Following</div>
      <div>→ LazyColumn with UserRow</div>
      <div>→ States: loading, loaded, empty, error</div>
    </div>
  </div>
</div>

<!-- Profile Family -->
<h3 class="section-sub" id="family-profile" style="margin-top:var(--space-2xl);border-bottom:3px solid var(--accent);padding-bottom:var(--space-sm)">Profile Family</h3>
<div class="grid-3">
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Profile</span>
    <h3>Profile (Self)</h3>
    <p>Own profile: avatar, name, stats row, settings shortcut cards, recent activity.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Avatar (TrainlyCard with image slot)</div>
      <div>→ Stat row (workouts, distance, time, streak)</div>
      <div>→ Interactive shortcut cards</div>
      <div>→ States: loading, loaded, error, offline</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Settings</span>
    <h3>Settings</h3>
    <p>Grouped settings list with toggles, navigations, and external links. All items functional.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Section headers (bold uppercase)</div>
      <div>→ TrainlyCard for each setting group</div>
      <div>→ Toggles → TrainlySwitch component</div>
      <div>→ States: loaded, saving</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Info / Edit</span>
    <h3>Personal Info / Edit Stats</h3>
    <p>Form screens for editing profile fields and fitness metrics.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ TrainlyInput fields</div>
      <div>→ Validation on submit</div>
      <div>→ States: editing, saving, error, saved</div>
    </div>
  </div>
</div>

<!-- Analytics Family -->
<h3 class="section-sub" id="family-analytics" style="margin-top:var(--space-2xl);border-bottom:3px solid var(--accent);padding-bottom:var(--space-sm)">Analytics Family</h3>
<div class="grid-3">
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Stats</span>
    <h3>Stats Dashboard</h3>
    <p>Period-picker (Week/Month/Year/YTD), metric cards, trend charts, comparison.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ TrainlyChip row for period selection</div>
      <div>→ TrainlyCard (accent) for key metrics</div>
      <div>→ Chart cards (Coil + Canvas)</div>
      <div>→ States: loading, loaded, empty, error, offline</div>
    </div>
  </div>
  <div class="card">
    <span class="badge secondary" style="margin-bottom:var(--space-sm)">Achievements</span>
    <h3>Achievements</h3>
    <p>Grid of earned and locked achievements. Progress bars for in-progress ones.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ LazyGrid of achievement cards</div>
      <div>→ TrainlyBadge for earned/locked</div>
      <div>→ Progress bar for in-progress</div>
      <div>→ States: loading, loaded, empty, error</div>
    </div>
  </div>
</div>

<!-- Emergency Family -->
<h3 class="section-sub" id="family-emergency" style="margin-top:var(--space-2xl);border-bottom:3px solid var(--danger);padding-bottom:var(--space-sm)">Emergency Family</h3>
<div class="grid-3">
  <div class="card" style="border-color:var(--danger)">
    <span class="badge danger" style="margin-bottom:var(--space-sm)">SOS</span>
    <h3>Emergency SOS</h3>
    <p>Large panic button (full-screen overlay). Location sharing. Timer countdown. Auto-alert contacts.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ Giant SOS button (min 120dp)</div>
      <div>→ Location permissions dialog</div>
      <div>→ Countdown timer</div>
      <div>→ States: idle, countdown, alerting, alerted, error</div>
    </div>
  </div>
  <div class="card" style="border-color:var(--warning)">
    <span class="badge warning" style="margin-bottom:var(--space-sm)">Contacts</span>
    <h3>Emergency Contacts</h3>
    <p>Editable list of emergency contacts. Add/remove/reorder. SMS notification status.</p>
    <div style="font-size:12px;color:var(--muted);font-weight:600">
      <div>→ LazyColumn with UserRow</div>
      <div>→ Add contact CTA</div>
      <div>→ Priority ordering</div>
      <div>→ States: loading, loaded, empty, error</div>
    </div>
  </div>
</div>
</section>

<!-- ════════════════════════════════════════════════════════ -->
<!-- INTERACTION RULES                                       -->
<!-- ════════════════════════════════════════════════════════ -->
<section class="section" id="interactions">
<div class="section-header">
  <h2>Interaction Rules</h2>
  <span class="file-ref">interactions.md</span>
</div>
<div class="section-desc">
  Bold, tactile interactions consistent with the neo-brutalist design language.
  Every primary action is reachable within 1 tap. Common flows complete in 2 taps or fewer.
  Emergency access never requires deep navigation.
</div>

<div class="grid-2">
  <div class="card">
    <h3>Touch Targets</h3>
    <div class="rule-list" style="gap:var(--space-sm)">
      <div class="rule-item" style="padding:var(--space-sm);gap:var(--space-sm)"><span class="r-icon" style="width:24px;height:24px;font-size:12px;font-weight:800">48</span> Minimum 48dp for all interactive elements</div>
      <div class="rule-item" style="padding:var(--space-sm);gap:var(--space-sm)"><span class="r-icon" style="width:24px;height:24px;font-size:12px;font-weight:800">56</span> Primary CTA buttons: 56dp minimum</div>
      <div class="rule-item" style="padding:var(--space-sm);gap:var(--space-sm)"><span class="r-icon" style="width:24px;height:24px;font-size:12px;font-weight:800">120</span> SOS button: 120dp minimum</div>
      <div class="rule-item" style="padding:var(--space-sm);gap:var(--space-sm)"><span class="r-icon" style="width:24px;height:24px;font-size:12px;font-weight:800">12</span> Minimum spacing between touch targets: 12dp</div>
    </div>
  </div>
  <div class="card">
    <h3>Tap Budget</h3>
    <div class="rule-list" style="gap:var(--space-sm)">
      <div class="rule-item" style="padding:var(--space-sm);gap:var(--space-sm)"><span class="r-icon" style="width:24px;height:24px;font-size:12px;font-weight:800">1</span> Primary action reachable in 1 tap</div>
      <div class="rule-item" style="padding:var(--space-sm);gap:var(--space-sm)"><span class="r-icon" style="width:24px;height:24px;font-size:12px;font-weight:800">2</span> Common flows complete in 2 taps or fewer</div>
      <div class="rule-item" style="padding:var(--space-sm);gap:var(--space-sm)"><span class="r-icon" style="width:24px;height:24px;font-size:12px;font-weight:800">0</span> Emergency access: 0 taps (system-level overlay)</div>
      <div class="rule-item" style="padding:var(--space-sm);gap:var(--space-sm)"><span class="r-icon" style="width:24px;height:24px;font-size:12px;font-weight:800">3</span> Max depth: 3 taps from tab start to destination</div>
    </div>
  </div>
</div>

<h3 class="section-sub">Press Behavior</h3>
<div class="code-block">
<span class="cm">// InteractionModifiers.kt — Reusable press animations</span>
<span class="kw">fun</span> Modifier.trainlyPress(): Modifier = <span class="kw">this</span>
    .graphicsLayer {
        scaleX = <span class="num">1f</span>
        scaleY = <span class="num">1f</span>
        shadowElevation = <span class="num">0f</span>
    }
    .pointerInput(Unit) {
        detectTapGestures(
            onPress = {
                <span class="cm">// Scale to 0.97, flatten shadow</span>
                awaitRelease()
                <span class="cm">// Restore</span>
            }
        )
    }
</div>

<h3 class="section-sub">Interaction Anti-Patterns</h3>
<div class="rule-list">
  <div class="rule-item"><span class="r-icon" style="background:var(--danger);color:#fff">✕</span> No dead-end tab navigation (tabs always navigate somewhere)</div>
  <div class="rule-item"><span class="r-icon" style="background:var(--danger);color:#fff">✕</span> No duplicate routes (Stats/Profile/Community registered once)</div>
  <div class="rule-item"><span class="r-icon" style="background:var(--danger);color:#fff">✕</span> No ambiguous back behavior (back always pops the current graph)</div>
  <div class="rule-item"><span class="r-icon" style="background:var(--danger);color:#fff">✕</span> No hidden actions (every action has a visible, labeled control)</div>
  <div class="rule-item"><span class="r-icon" style="background:var(--danger);color:#fff">✕</span> No extra back press on workout save flow</div>
</div>
</section>

<!-- ════════════════════════════════════════════════════════ -->
<!-- STATE DESIGN                                            -->
<!-- ════════════════════════════════════════════════════════ -->
<section class="section" id="states">
<div class="section-header">
  <h2>State Design</h2>
  <span class="file-ref">TrainlyEmptyState.kt · TrainlyLoading.kt · TrainlyErrorState.kt</span>
</div>
<div class="section-desc">
  Every screen implements five states through a common state-sealed-class pattern.
  The state controls which visual layer is active. Transitions between states use
  the motion system defined below.
</div>

<h3 class="section-sub">State Layer Pattern</h3>
<div class="code-block">
<span class="cm">// ScreenUiState.kt — Reusable state sealed class</span>
sealed <span class="kw">class</span> ScreenUiState&lt;<span class="kw">out</span> T&gt; {
    <span class="kw">object</span> Loading : ScreenUiState&lt;Nothing&gt;()
    <span class="kw">data class</span> Empty(message: String, actionLabel: String?) : ScreenUiState&lt;Nothing&gt;()
    <span class="kw">data class</span> Error(message: String, retryable: Boolean) : ScreenUiState&lt;Nothing&gt;()
    <span class="kw">data class</span> Offline(cachedData: <span class="tp">Any?</span>) : ScreenUiState&lt;Nothing&gt;()
    <span class="kw">data class</span> Success&lt;T&gt;(<span class="kw">val</span> data: T) : ScreenUiState&lt;T&gt;()
}
</div>

<h3 class="section-sub">State Mapping</h3>
<div class="state-grid">
  <div class="state-card">
    <div class="s-icon" style="color:var(--muted)">⏳</div>
    <div class="s-name">Loading</div>
    <div class="s-desc">TrainlyLoading (fullscreen or inline). Skeleton cards for list screens.</div>
  </div>
  <div class="state-card">
    <div class="s-icon" style="color:var(--muted)">□</div>
    <div class="s-name">Empty</div>
    <div class="s-desc">TrainlyEmptyState with icon, message, and optional action CTA.</div>
  </div>
  <div class="state-card">
    <div class="s-icon" style="color:var(--danger)">!</div>
    <div class="s-name">Error</div>
    <div class="s-desc">TrainlyCard with error message + retry TrainlyButton. Persistent error state.</div>
  </div>
  <div class="state-card">
    <div class="s-icon" style="color:var(--warning)">📶</div>
    <div class="s-name">Offline</div>
    <div class="s-desc">Banner at top of screen. Cached data shown below. Offline badge in top bar.</div>
  </div>
  <div class="state-card">
    <div class="s-icon" style="color:var(--success)">✓</div>
    <div class="s-name">Success</div>
    <div class="s-desc">Normal content rendering with loaded data.</div>
  </div>
</div>

<h3 class="section-sub">State Composition in Screens</h3>
<div class="code-block">
<span class="cm">// Example: WorkoutHistoryScreen.kt</span>
<span class="tp">TrainlyScaffold</span>(topBar = { ... }, bottomBar = { ... }) { padding <span class="cm">-></span>
    <span class="kw">when</span> (<span class="kw">val</span> state = viewModel.uiState.collectAsStateWithLifecycle().<span class="kw">value</span>) {
        <span class="kw">is</span> ScreenUiState.Loading    -> TrainlyLoading.Fullscreen()
        <span class="kw">is</span> ScreenUiState.Empty      -> TrainlyEmptyState(message = state.message, action = ...)
        <span class="kw">is</span> ScreenUiState.Error      -> TrainlyErrorState(message = state.message, onRetry = ...)
        <span class="kw">is</span> ScreenUiState.Offline    ->
            Column {
                OfflineBanner()
                <span class="kw">if</span> (state.cachedData != <span class="kw">null</span>) WorkoutHistoryList(state.cachedData)
            }
        <span class="kw">is</span> ScreenUiState.Success    -> WorkoutHistoryList(state.data, onItemClick = ...)
    }
}
</div>
</section>

<!-- ════════════════════════════════════════════════════════ -->
<!-- MOTION & ANIMATION                                      -->
<!-- ════════════════════════════════════════════════════════ -->
<section class="section" id="motion">
<div class="section-header">
  <h2>Motion &amp; Animation</h2>
  <span class="file-ref">animation/</span>
</div>
<div class="section-desc">
  Subtle tactile motion reinforces the physical feel of the neo-brutalist system.
  Presses scale and flatten shadows. Transitions use spring physics for natural feel.
  No heavy motion, no complex choreography, no parallax.
</div>

<h3 class="section-sub">Animation Tokens</h3>
<div class="grid-3">
  <div class="card">
    <h3>Press Interaction</h3>
    <p>Scale 1.0 → 0.97 on press down. Shadow flattens. Spring stiffness: 400, damping: 25.</p>
    <div class="badge outline sm" style="margin-top:var(--space-sm)">100ms spring</div>
  </div>
  <div class="card">
    <h3>Screen Transitions</h3>
    <p>Slide in from right (enter), slide out to left (exit). Bottom sheets slide up.</p>
    <div class="badge outline sm" style="margin-top:var(--space-sm)">250ms slide</div>
  </div>
  <div class="card">
    <h3>State Transitions</h3>
    <p>Content fades in. Empty/error states crossfade. Offline banner slides down from top.</p>
    <div class="badge outline sm" style="margin-top:var(--space-sm)">200ms fade</div>
  </div>
</div>

<h3 class="section-sub">Motion Rules</h3>
<div class="rule-list">
  <div class="rule-item"><span class="r-icon">✓</span> Use scale + shadow flatten for press feedback</div>
  <div class="rule-item"><span class="r-icon">✓</span> Use spring-based transitions (stiffness 400, damping 25)</div>
  <div class="rule-item"><span class="r-icon">✓</span> Keep transitions under 300ms</div>
  <div class="rule-item"><span class="r-icon" style="background:var(--danger);color:#fff">✕</span> No parallax, no complex choreography</div>
  <div class="rule-item"><span class="r-icon" style="background:var(--danger);color:#fff">✕</span> No over-animated transitions</div>
  <div class="rule-item"><span class="r-icon" style="background:var(--danger);color:#fff">✕</span> No heavy motion on data screens</div>
</div>

<div class="code-block">
<span class="cm">// MotionTokens.kt — Centralized animation values</span>
<span class="kw">object</span> TrainlyMotion {
    <span class="kw">val</span> PressSpring = spring(
        dampingRatio = Spring.DampingRatioMediumBouncy,
        stiffness = Spring.StiffnessMedium <span class="cm">// ~400</span>
    )
    <span class="kw">val</span> TransitionDuration = <span class="num">250</span>.milliseconds
    <span class="kw">val</span> FadeDuration = <span class="num">200</span>.milliseconds
}
</div>
</section>

<!-- ════════════════════════════════════════════════════════ -->
<!-- PHASED EXECUTION                                        -->
<!-- ════════════════════════════════════════════════════════ -->
<section class="section" id="phases">
<div class="section-header">
  <h2>Phased Execution Plan</h2>
  <span class="file-ref">ROADMAP.md</span>
</div>
<div class="section-desc">
  Five-phase execution following the design-system-first approach. Each phase has a clear
  scope boundary. No phase depends on a later phase. Phases can be worked in parallel
  by different team members.
</div>

<div class="priority-list">
  <div class="priority-item">
    <div class="p-num">P1</div>
    <div class="p-content">
      <div class="p-title">Phase 1 — Design System Foundation</div>
      <div class="p-desc">Complete all theme files (Color.kt, Typography.kt, Shapes.kt, Spacing.kt, Borders.kt, Shadows.kt, Elevation.kt, Theme.kt, Dimensions.kt, NeoBrutalTokens.kt). Build all 11 core UI primitives (TrainlyButton, TrainlyCard, TrainlyInput, TrainlyTopBar, TrainlyBottomBar, TrainlyScaffold, TrainlyDialog, TrainlyChip, TrainlyBadge, TrainlyEmptyState, TrainlyLoading). No screen rewrites yet.</div>
      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-sm)">
        <span class="badge accent sm">10 files</span>
        <span class="badge secondary sm">11 components</span>
        <span class="badge outline sm">~2 days</span>
      </div>
    </div>
  </div>
  <div class="priority-item">
    <div class="p-num">P2</div>
    <div class="p-content">
      <div class="p-title">Phase 2 — Navigation & Shell</div>
      <div class="p-desc">Restructure NavHost into 8 nested graphs. Implement TrainlyScaffold with all top bar variants. Wire bottom navigation to graph start destinations. Add dialog, snackbar, and modal sheet systems. Remove dual-route registration. Standardize back behavior. Build empty/loading/error state primitives.</div>
      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-sm)">
        <span class="badge accent sm">NavGraph.kt</span>
        <span class="badge secondary sm">Shell refactor</span>
        <span class="badge outline sm">~3 days</span>
      </div>
    </div>
  </div>
  <div class="priority-item">
    <div class="p-num">P3</div>
    <div class="p-content">
      <div class="p-title">Phase 3 — Core Screens</div>
      <div class="p-desc">Redesign Auth (Splash, Login, Register), Home/Dashboard, Training Selection, Active workout screens (Running, Cycling, Swimming, Gym), Workout Summary, Workout History, Workout Detail. Extract reusable composables from screen patterns. Wire state handling (loading/empty/error/offline/success).</div>
      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-sm)">
        <span class="badge accent sm">12 screens</span>
        <span class="badge outline sm">~5 days</span>
      </div>
    </div>
  </div>
  <div class="priority-item">
    <div class="p-num">P4</div>
    <div class="p-content">
      <div class="p-title">Phase 4 — Feature Screens</div>
      <div class="p-desc">Redesign Social (Community Feed, Create Post, Comments, User Profile, Find Friends, Followers, Following), Analytics (Stats, Achievements), Emergency (SOS, Contacts), Profile (Profile, Settings, Personal Info, Edit Stats). Apply same composable patterns from Phase 3.</div>
      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-sm)">
        <span class="badge accent sm">15 screens</span>
        <span class="badge outline sm">~5 days</span>
      </div>
    </div>
  </div>
  <div class="priority-item">
    <div class="p-num">P5</div>
    <div class="p-content">
      <div class="p-title">Phase 5 — Polish & Accessibility</div>
      <div class="p-desc">Finalize motion system (press animations, screen transitions). Add microinteractions (pull-to-refresh, loading skeletons, state transitions). Accessibility audit (contrast, touch targets, screen reader labels, scalable text). Dark mode refinement. Tablet and landscape responsiveness. Performance optimization (recomposition profiling, LazyColumn optimization).</div>
      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-sm)">
        <span class="badge accent sm">Motion</span>
        <span class="badge secondary sm">A11y</span>
        <span class="badge outline sm">~3 days</span>
      </div>
    </div>
  </div>
</div>

<h3 class="section-sub">Dependency Map</h3>
<div class="diagram">
<pre>P1: Design System ──────────────────────┐
                                        ├──→ P3: Core Screens ──→ P4: Feature Screens
P2: Navigation & Shell ─────────────────┘                           │
                                                                    ↓
                                                            P5: Polish & A11y
</pre>
</div>
</section>

<!-- ════════════════════════════════════════════════════════ -->
<!-- PRIORITY MAP                                            -->
<!-- ════════════════════════════════════════════════════════ -->
<section class="section" id="priorities" style="border-bottom:none">
<div class="section-header">
  <h2>Priority Map</h2>
  <span class="file-ref">Architecture Decision Records</span>
</div>
<div class="section-desc">
  Architecture decisions ranked by impact. Decisions marked P0 block all downstream work.
</div>

<table class="flow-table">
  <tr><th>Priority</th><th>Decision</th><th>Impact</th><th>Phase</th></tr>
  <tr>
    <td><span class="badge danger sm">P0</span></td>
    <td>Nested NavGraph with 8 graphs</td>
    <td>Eliminates monolithic graph, enables per-graph back behavior</td>
    <td>P2</td>
  </tr>
  <tr>
    <td><span class="badge danger sm">P0</span></td>
    <td>TrainlyScaffold as unified shell</td>
    <td>Standardizes top bar, bottom nav, snackbar, dialogs across all screens</td>
    <td>P2</td>
  </tr>
  <tr>
    <td><span class="badge danger sm">P0</span></td>
    <td>Theme tokens in 10 dedicated files</td>
    <td>Single source of truth for all visual properties</td>
    <td>P1</td>
  </tr>
  <tr>
    <td><span class="badge accent sm">P1</span></td>
    <td>ScreenUiState sealed class</td>
    <td>Consistent state handling across all 27 screens</td>
    <td>P2</td>
  </tr>
  <tr>
    <td><span class="badge accent sm">P1</span></td>
    <td>Bottom nav tab reset on re-selection</td>
    <td>Eliminates dead-end tab navigation</td>
    <td>P2</td>
  </tr>
  <tr>
    <td><span class="badge accent sm">P1</span></td>
    <td>Emergency SOS as system overlay</td>
    <td>Global accessibility from any screen without deep nav</td>
    <td>P2</td>
  </tr>
  <tr>
    <td><span class="badge secondary sm">P2</span></td>
    <td>Shared ActiveWorkout composable</td>
    <td>Eliminates duplicate workout screen code across 4 sports</td>
    <td>P3</td>
  </tr>
  <tr>
    <td><span class="badge secondary sm">P2</span></td>
    <td>UserRow composable</td>
    <td>Reused across Social, Profile, Emergency families (6+ screens)</td>
    <td>P3</td>
  </tr>
  <tr>
    <td><span class="badge outline sm">P3</span></td>
    <td>Motion system tokens</td>
    <td>Consistent animation behavior across all interactions</td>
    <td>P5</td>
  </tr>
  <tr>
    <td><span class="badge outline sm">P3</span></td>
    <td>Dark mode & tablet responsiveness</td>
    <td>Extends reach without affecting core UX</td>
    <td>P5</td>
  </tr>
</table>
</section>

</div>
</div>
</body>
</html>
