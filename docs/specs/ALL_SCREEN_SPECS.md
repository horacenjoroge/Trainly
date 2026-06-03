# Trainly — Complete Screen Specifications (Non-Auth)

> **Design System Baseline:** Neo-brutalist — zero card radius, 2dp borders, hard offset shadows, emoji icons, #FDC800 yellow accent, Inter font family.  
> **Color context:** Auth uses #FDC800 yellow accent, main theme uses #E57C0B orange primary.

---

## Table of Contents

1. [Onboarding (3 screens)](#1-onboarding)
2. [Main Screen (Bottom Tab Host)](#2-main-screen)
3. [Home Tab](#3-home-tab)
4. [Stats Tab](#4-stats-tab)
5. [Community Tab](#5-community-tab)
6. [Profile Tab](#6-profile-tab)
7. [Workout Screens (7)](#7-workout-screens)
8. [Social Screens (6)](#8-social-screens)
9. [Profile & Settings (3)](#9-profile--settings)
10. [Emergency (2)](#10-emergency)
11. [Achievements (1)](#11-achievements)

---

## 1. Onboarding

### 1.1 Onboarding — Slide 1: "Track Everything"
**Route:** _new — `onboarding_1`_  
**Purpose:** Introduce workout tracking capability.

| Zone | Element | Spec |
|------|---------|------|
| Hero | Full-bleed illustration | Large emoji: 🏃‍♂️🚴‍♂️🏊‍♂️🏋️ (layered), centered, 80dp+ |
| Headline | Title | "Track Every Move" — Bold, 32sp, #1C293C |
| Subtitle | Body text | "Running, cycling, swimming, or gym — log every rep, mile, and lap with GPS-powered precision." — 16sp, #5A6B7E |
| Footer | Dot indicator | 3 dots: `● ○ ○` — first lit (#FDC800) |
| CTA | Button | "Next" — yellow #FDC800 bg, #1C293C text, full-width |

**Interaction:** Tap "Next" → slide 2.  
**Skip:** Top-right "Skip" text button → go to Login.  
**Entry:** First launch only (check `DataStore` flag).

### 1.2 Onboarding — Slide 2: "Join the Community"
**Route:** _new — `onboarding_2`_

| Zone | Element | Spec |
|------|---------|------|
| Hero | Illustration | 👥 emoji, 80dp |
| Headline | Title | "Find Your Crew" |
| Subtitle | Body | "Share workouts, cheer friends on, and compete on leaderboards. Fitness is better together." |
| Footer | Dot indicator | `○ ● ○` |
| CTA | Button | "Next" |

**Interaction:** Tap "Next" → slide 3.  
**Skip:** Available.

### 1.3 Onboarding — Slide 3: "Stay Safe"
**Route:** _new — `onboarding_3`_

| Zone | Element | Spec |
|------|---------|------|
| Hero | Illustration | 🚨 emoji, 80dp |
| Headline | Title | "Your Safety Net" |
| Subtitle | Body | "One-tap SOS alerts your emergency contacts with your real-time location. Run fearlessly." |
| Footer | Dot indicator | `○ ○ ●` |
| CTA | Button | "Get Started" — leads to Login |

**Interaction:** Tap "Get Started" → Login screen. Set `onboarding_complete = true` in DataStore.

---

## 2. Main Screen (Bottom Tab Host)

### 2.1 MainScreen
**Route:** `main`  
**Purpose:** Hosts the 4 bottom tabs and handles nested navigation.

| Zone | Element | Spec |
|------|---------|------|
| Body | `NavHost` | 4 tab destinations: Home, Stats, Community, Profile |
| Bottom bar | `TrainlyBottomNav` | 4 items with emoji icons (🏠, 📊, 👥, 👤) and labels "Home", "Stats", "Community", "Profile" |
| Behavior | Tab switching | `popUpTo(start) + saveState + restoreState` — preserves scroll position per tab |

**Navigation:**  
- Home tab → callbacks: onStats, onProfile, onTrain, onWorkoutHistory, onCommunity
- Stats tab → onBack (pop rootNav)
- Community tab → onCreatePost, onComment(postId), onUserClick(userId)
- Profile tab → onSettings, onWorkoutHistory, onAchievements, onStats

**Status:** ✅ Built — fully functional.

---

## 3. Home Tab

### 3.1 HomeScreen
**Route:** `home` (tab: `tab_home`)  
**Purpose:** Dashboard — user's daily landing page showing progress snapshot and community feed.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | Title "Trainly" | Left-aligned. Right: 🔔 bell icon (notifications), 👤 profile icon |
| Progress | Section card "My Progress" | Shows `totalWorkouts` (bold primary), `totalDuration`h total. "View Stats" text button |
| Quick actions | Row of 2 cards | ▶️ "Start Training" / 📋 "History" — each 50% width, tappable |
| Feed header | "Community Feed" row | Title left, "See All" text button right |
| Feed | PostCard × 3 | Top 3 recent posts. Each: avatar + name, content, workout share, like/comment counts |
| Empty state | `TrainlyEmpty` | 👋 "No posts yet" + "Be the first to share!" |

**Mock Data Values:**
- `totalWorkouts`: 12
- `totalDuration`: 540 (minutes → "9h total")
- `totalCalories`: 4200
- Like counts: 5–89 range
- Comment counts: 0–12 range

**Interaction:** Tap "Start Training" → TrainingSelection. Tap "History" → WorkoutHistory. Tap post card → CommentScreen. Tap user avatar → UserProfile.  
**Status:** ✅ Built — skeleton functional, needs real data loading and progress charts.

---

## 4. Stats Tab

### 4.1 StatsScreen
**Route:** `stats` (tab: `tab_stats`)  
**Purpose:** Analytics dashboard with period filtering, metric cards, and chart areas.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Workout Stats" | ← back arrow |
| Filter | Chip row | **7D · 30D · 90D · 1Y** — `TrainlyChip` toggleable. Default: 7D |
| Metrics row | 2-column | 🏃 `totalWorkouts` (bold) "Workouts" / ⏱ `formattedDuration` "Total Time" |
| Metric cards | Row of 2 | 📍 `Distance` ("12.4 km") / 🔥 `Calories` ("4,200") — `TrainlyMetricCard` |
| Chart 1 | "Activity Breakdown" | **Donut/pie chart** placeholder. 4 segments: Running 45%, Cycling 25%, Swimming 15%, Gym 15% |
| Chart 2 | "Weekly Trend" | **Bar chart** placeholder. 7 bars showing workouts per day (Mon-Sun). |
| Chart data (mock) | Per 7D period | {Mon: 1, Tue: 2, Wed: 0, Thu: 1, Fri: 3, Sat: 1, Sun: 2} = 10 workouts |

**Interaction:** Tap chip → reload stats for selected period.  
**Status:** ✅ Built — charts are placeholders ("Chart placeholder" / "Trend chart placeholder"), metrics functional.  
**Gap:** Needs Canvas-drawn or library-based charts (bar + donut).

---

## 5. Community Tab

### 5.1 CommunityFeedScreen
**Route:** `community_feed` (tab: `tab_community`)  
**Purpose:** Social feed of all user posts.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Community" | Right: "+" button to create post |
| Search | `TrainlySearchBar` | "Search users..." placeholder — calls `viewModel.search()` |
| Feed | LazyColumn of `PostCard` | Each card: avatar + userName, timestamp, content text, optional image, workout share, like ❤️ count, 💬 comment count |
| Empty | `TrainlyEmpty` | 👋 "No posts yet" |

**PostCard Layout (top to bottom):**
1. **Header row:** Avatar (32dp) + userName (bold) + createdAt (time ago, gray)
2. **Content:** Body text (14sp, max 3 lines)
3. **Workout badge** (_if workout attached_): Small card showing workout type icon + duration + distance
4. **Image** (_if attached_): Full-width image (Coil `AsyncImage`)
5. **Action row:** ❤️ like count (tappable) · 💬 comment count (tappable)

**Mock Posts (10 total for feed):**
| # | User | Content | Workout | Likes | Comments |
|---|------|---------|---------|-------|----------|
| 1 | Alex Chen | "New PB on the trail today! 🏃‍♂️" | Running 5.2km, 28min | 24 | 3 |
| 2 | Jordan Rivera | "Morning ride was brutal but worth it" | Cycling 32km, 1h12min | 18 | 5 |
| 3 | Sam Patel | "Finally hit 100kg bench press! 💪" | Gym workout | 42 | 7 |
| 4 | Maya Thompson | "Open water swim at sunrise 🌅" | Swimming 2km, 45min | 31 | 2 |
| 5 | Carlos Ruiz | "Rest day = active recovery walk" | Walking 3km | 8 | 1 |
| 6 | Lena Kim | "Weekend long run complete. Half marathon prep!" | Running 18km, 1h35min | 56 | 12 |
| 7 | James Wilson | "New bike day! First ride was amazing" | Cycling 25km, 50min | 89 | 15 |
| 8 | Priya Sharma | "Evening gym session. Leg day 🦵" | Gym workout | 15 | 4 |
| 9 | Tom Baker | "Pool record — 100 laps!" | Swimming 2.5km, 1h | 34 | 6 |
| 10 | Emma Davis | "Great community run this morning" | Running 8km, 42min | 12 | 2 |

**Interaction:** ❤️ toggle like (optimistic). 💬 → CommentScreen. Avatar → UserProfile. "+" → CreatePost.  
**Status:** ✅ Built — fully functional with like/search, needs comment navigation wired.

---

## 6. Profile Tab

### 6.1 ProfileScreen
**Route:** `profile` (tab: `tab_profile`)  
**Purpose:** Own profile with stats, quick links to other screens.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Profile" | Right: ⚙️ settings gear icon → Settings |
| Avatar section | Centered column | `TrainlyAvatar` hero size, userName (bold, titleLarge), userBio (bodyMedium, gray) |
| Stats row | 3-column centered | `followers` "Followers" / `following` "Following" / `workouts` "Workouts" — each bold number above label |
| Quick links | Row of 3 cards | 📋 "History" / 🏆 "Achievements" / 📊 "Stats" — evenly weighted, centered icon + label |
| Quick stats | Section card | 🔥 Calories = 4,200 / ⏱ Hours = 9h |

**Mock Data:**
- userName: "Alex Johnson"
- userBio: "Runner & weekend cyclist. Marathon PB: 3:45."
- followers: 128 / following: 94 / workouts: 12
- calories: 4200 / hours: 9

**Interaction:** Tap card → respective screen.  
**Status:** ✅ Built — fully functional.

---

## 7. Workout Screens

### 7.1 TrainingSelectionScreen
**Route:** `training_selection`  
**Purpose:** Choose workout type before starting a session.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Choose Your Training" | ← back |
| Cards | 4 `TrainlyCard` × 120dp | Each: icon (56dp surface) + name (bold) + description (gray) + chevron right |
| Card 1 | 🏃 "Running Trail" | "High-intensity cardio" |
| Card 2 | 🚴 "Bike Trail" | "Endurance ride" |
| Card 3 | 🏊 "Swimming" | "Full body workout" |
| Card 4 | 🏋️ "Gym Session" | "Strength training" |

**Status:** ✅ Built — fully functional.

---

### 7.2 RunningScreen
**Route:** `running`  
**Purpose:** Real-time GPS running tracker.

| Zone | Element | Spec |
|------|---------|------|
| Header | Title "Running" + timer | Timer in `displayLarge` (57sp). Shows "PAUSED" overlay when paused |
| Map | GPS route canvas | 200dp card. Draws polyline from `gpsPoints`. Shows "Waiting for GPS..." when no fix |
| Stats row | 3 `TrainlyTrackingStat` | 📍 Distance (km) / 🏃 Pace (min/km) / 🔥 Calories |
| Controls | `TrainlyTrackingControls` | **Start/Pause** (PRIMARY→ERROR), **Finish** (SECONDARY), **Split** (OUTLINE) |
| Dialog | `TrainlyConfirmDialog` | Save confirmation on Finish |

**Metrics displayed:**
- Distance: 0.0 → 42.2 km
- Pace: 3:30 → 7:30 min/km
- Duration: 00:00:00 → HH:MM:SS
- Calories: estimated from distance × weight
- Splits: auto-recorded every 1km or manual

**Status:** ✅ Built — fully functional with GPS, timer, split recording, save dialog.

---

### 7.3 CyclingScreen
**Route:** `cycling`  
**Purpose:** Real-time GPS cycling tracker.

| Zone | Element | Spec |
|------|---------|------|
| Header | Title "Cycling" + timer | Same as Running |
| Map | GPS route canvas | Same as Running |
| Stats row | 3 stats | 📍 Distance (km) / 🏃 Speed (km/h) / 🔥 Calories |
| Controls | Start/Pause + Finish | Same pattern. No Split button |
| Dialog | Save confirmation | Same pattern |

**Metrics (different from Running):**
- Speed: km/h instead of pace
- Distance: typically longer (10–100km)
- Duration / Calories

**Status:** ✅ Built — same infrastructure as Running, stats labels should say "Speed" not "Pace."

---

### 7.4 SwimmingScreen
**Route:** `swimming`  
**Purpose:** Lap-based swimming tracker.

| Zone | Element | Spec |
|------|---------|------|
| Header | Title "Swimming" + timer | Same pattern |
| Map | GPS route canvas | Disabled for pool swimming — show lap counter instead |
| Stats row | 2 stats | 📍 Distance (m) / 🔥 Calories — **no pace** |
| Controls | Start/Pause + Finish | Same pattern |
| Dialog | Save confirmation | Same pattern |

**Metrics:**
- Distance: in meters (25m pool → 100m = 4 laps)
- Laps: manual tap per lap
- Stroke type: Freestyle / Backstroke / Breaststroke / Butterfly

**Gap:** Current code shows GPS map (irrelevant for pool swimming). Replace map area with **lap counter** — large + / − buttons, current lap count, pool length selector (25m / 50m).

---

### 7.5 GymWorkoutScreen
**Route:** `gym_workout`  
**Purpose:** Exercise and set tracking for strength training.

| Zone | Element | Spec |
|------|---------|------|
| Header | Title "Gym Workout" + timer | Same pattern |
| Exercise list | LazyColumn | Each exercise card: name (bold), muscle group (gray), set list below |
| Empty state | Centered | 🏋️ "Add exercises" prompt |
| FAB | "+" button | Bottom-right, 56dp circle → "Add Exercise" dialog |
| Controls | Start/Pause + Finish | Same pattern |
| Dialog 1 | Add Exercise | Name text field + Muscle group chips: [Chest] [Back] [Legs] [Shoulders] [Arms] |
| Dialog 2 | Add Set | Reps (number) + Weight (kg, decimal) inputs |

**Exercise/Sets Display (per card):**
```
Bench Press — Chest
  Set 1: 10 reps @ 60kg
  Set 2: 8 reps @ 70kg
  Set 3: 6 reps @ 75kg
  [+ Add Set]
```

**Mock Exercises:**
| Exercise | Muscle Group | Sets |
|----------|-------------|------|
| Bench Press | Chest | 3 sets: 10×60, 8×70, 6×75 |
| Barbell Row | Back | 3 sets: 8×50, 8×55, 6×60 |
| Squat | Legs | 4 sets: 10×80, 8×90, 6×100, 6×100 |
| Overhead Press | Shoulders | 3 sets: 8×30, 8×32.5, 6×35 |
| Bicep Curl | Arms | 3 sets: 12×12, 10×14, 8×16 |

**Gap:** Add Set dialog not wired to `onClick`. Muscle groups need expansion (Shoulders, Arms). Need RPE field per set.

---

### 7.6 WorkoutHistoryScreen
**Route:** `workout_history`  
**Purpose:** List of past workouts.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Workout History" | ← back |
| List | `TrainlyFeedLayout` with LazyColumn | Each item: `TrainlyListItemCard` — icon (by type), title (workout name), subtitle (time ago), trailing (duration), trailingLabel (calories) |
| Empty | `TrainlyEmpty` | 🏃 "No workouts yet" + "Start your fitness journey!" |

**Mock History:**
| Type | Name | Date | Duration | Calories |
|------|------|------|----------|----------|
| 🏃 | Trail Run | 2h ago | 28:00 | 320 |
| 🚴 | Bike Trail | Yesterday | 1:12:00 | 580 |
| 🏋️ | Gym Session | Yesterday | 45:00 | 210 |
| 🏃 | Morning Run | 2 days ago | 35:00 | 400 |
| 🏊 | Pool Laps | 3 days ago | 40:00 | 350 |

**Interaction:** Tap item → WorkoutDetail.  
**Status:** ✅ Built — fully functional.

---

### 7.7 WorkoutDetailScreen
**Route:** `workout_detail/{workoutId}`  
**Purpose:** Detailed view of a single completed workout.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Workout Details" | ← back |
| Hero | `TrainlyHeroCard` | Type icon (emoji), workout name, time ago subtitle |
| Section: Summary | 2 × 2 grid | ⏱ Duration / 🔥 Calories / 📍 Distance (if applicable) / 📅 Date |
| Section: Notes | Text block | Optional notes field (bodyMedium, gray) |
| Section: Route Map | (_optional_) | GPS polyline if workout has coordinates |
| Section: Splits/Intervals | (_optional_) | Lap-by-lap breakdown if running/cycling |

**Mock Detail—Running:**
```
🏃 Trail Run — 2 hours ago

Summary
  ⏱ Duration: 28:00    🔥 Calories: 320
  📍 Distance: 5.2km   📅 Date: Jan 15, 2026

Splits
  Km 1: 5:12
  Km 2: 5:08
  Km 3: 4:55
  Km 4: 5:02
  Km 5: 4:48
  Last 0.2km: 0:55

Notes
Great run! Felt strong after the hill climb.
```

**Mock Detail—Gym:**
```
🏋️ Gym Session — Yesterday

Summary
  ⏱ Duration: 45:00    🔥 Calories: 210

Exercises
  Bench Press
    Chest | 3 sets
    Set 1: 10 reps @ 60kg
    Set 2: 8 reps @ 70kg
    Set 3: 6 reps @ 75kg
  Squat
    Legs | 4 sets
    Set 1: 10 reps @ 80kg
    ...
```

**Status:** ✅ Built — basic summary works. Needs workout-type-specific sections.

---

## 8. Social Screens

### 8.1 CreatePostScreen
**Route:** `create_post`  
**Purpose:** Compose and share a new post.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Create Post" | ← back. Right: "Share" text button (bold, disabled if content blank) |
| Body | `TrainlyTextField` | 5 lines min, "What's on your mind?" placeholder |
| Error | `TrainlyErrorBanner` | Shows on API error |
| Loading | `TrainlyLoading` | "Posting..." overlay |

**Future additions** (_not yet built_):
- Attach image button
- Attach workout from history
- Privacy toggle (Public / Friends / Private)
- Location tag

**Status:** ✅ Built — text-only. No image/attachment support yet.

---

### 8.2 CommentScreen
**Route:** `comments/{postId}`  
**Purpose:** View and add comments on a post.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Comments" | ← back |
| List | `TrainlyFeedLayout` of `TrainlyUserCard` | Each: avatar + userName (bold) + comment text (subtitle) |
| Empty | `TrainlyEmpty` | 💬 "No comments yet" |
| Bottom bar | Input row | `TrainlyTextField` ("Comment...") + ➡ send icon button |

**Mock Comments:**
| User | Comment | Time |
|------|---------|------|
| Jordan Rivera | "Nice pace! 🔥" | 5m ago |
| Sam Patel | "Let me know next time you go!" | 12m ago |
| Maya Thompson | "Which trail is this?" | 1h ago |

**Status:** ✅ Built — functional with load/add comments.

---

### 8.3 UserProfileScreen
**Route:** `user_profile/{userId}`  
**Purpose:** View another user's profile.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Profile" | ← back |
| Body | Centered column | `TrainlyAvatar` hero size + name (headlineSmall, bold) |
| CTA | `TrainlyButton` | **Follow** (PRIMARY yellow) / **Unfollow** (OUTLINE) — toggleable |

**Gap:** Currently very minimal — only shows avatar, name, follow button. Needs:
- Bio text
- Stats row (workouts/distance/hours)
- Recent workouts list

**Status:** ⚠️ Built — minimal stub. Needs full profile data display.

---

### 8.4 FindFriendsScreen
**Route:** `find_friends`  
**Purpose:** Search and follow other users.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Find Friends" | ← back |
| Search | `TrainlySearchBar` | "Search..." — live filter on input |
| Results | LazyColumn of `TrainlyUserCard` | Each: avatar + name + "Follow" button (PRIMARY, small) |

**Mock Users:**
| Name | Mutual Friends |
|------|---------------|
| Jordan Rivera | 12 mutual |
| Sam Patel | 8 mutual |
| Maya Thompson | 3 mutual |
| Carlos Ruiz | 0 mutual |
| Lena Kim | 15 mutual |
| James Wilson | 7 mutual |
| Priya Sharma | 4 mutual |
| Tom Baker | 1 mutual |
| Emma Davis | 9 mutual |

**Status:** ✅ Built — functional search + follow.

---

### 8.5 FollowersListScreen
**Route:** `followers`  
**Purpose:** List of user's followers.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Followers" | ← back |
| List | LazyColumn of `TrainlyUserCard` | Each: avatar + name, clickable → UserProfile |
| Empty | `TrainlyEmpty` | 👥 "No users" |

**Status:** ✅ Built — functional.

### 8.6 FollowingListScreen
**Route:** `following`  
**Purpose:** List of users the current user follows.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Following" | ← back |
| List | LazyColumn of `TrainlyUserCard` | Same pattern as Followers |
| Empty | `TrainlyEmpty` | 👥 "No users" |

**Status:** ✅ Built — functional.

---

## 9. Profile & Settings

### 9.1 SettingsScreen
**Route:** `settings`  
**Purpose:** App settings, account info, and logout.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Settings" | ← back |
| User card | `TrainlyCard` row | Avatar (56dp, circular) + displayName (bold) + email (gray) + chevron right |
| Section: General | 🌟 Theme / 🔔 Notifications / 📍 Units / 🔒 Privacy | Each: icon + title + subtitle + chevron |
| Section: Account | 👤 Personal Info / 🏋️ Fitness Stats / 🚨 Emergency Contacts | Same pattern |
| Section: Support | ❓ Help Center / 📧 Contact Us / ℹ️ About (v1.0.0) | Same pattern |
| Button | "Log Out" | ERROR variant, full-width, 48dp. Shows loading when logging out |

**Status:** ✅ Built — fully functional with logout wired. Settings items are non-interactive (no sub-screens wired yet except via separate routes).

---

### 9.2 PersonalInfoScreen
**Route:** `personal_info`  
**Purpose:** Edit display name and bio.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Personal Info" | ← back. Right: "Save" text button |
| Form | `TrainlyFormLayout` | Name text field (singleLine) + Bio text area (3 lines min) |
| Loading | `TrainlyLoading` | Shows while saving |

**Status:** ✅ Built — functional.

---

### 9.3 EditStatsScreen
**Route:** `edit_stats`  
**Purpose:** Edit body metrics.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Edit Stats" | ← back. Right: "Save" text button |
| Form | `TrainlyFormLayout` | Weight (kg) text field + Height (cm) text field — both numeric input |

**Gap:** No units toggle (metric/imperial). No fitness level selector.  
**Status:** ✅ Built — basic. Needs expansion for goal settings.

---

## 10. Emergency

### 10.1 EmergencyServicesScreen
**Route:** `emergency`  
**Purpose:** SOS button and emergency settings.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Safety" | ← back |
| SOS button | 160dp circle | **"SOS"** in error red (#FF1744). Shows `TrainlyCircularLoader` when sending |
| Card 1 | Location tracking toggle | "Location Tracking" + "Active"/"Inactive" status + `Switch` |
| Card 2 | Emergency contacts | "Emergency Contacts" + "X contacts" count + "Manage" text button → ContactScreen |

**SOS Flow:**
1. Tap SOS button → `TrainlyConfirmSheet` slides up: "Send SOS alert to your emergency contacts?"
2. Confirm → 5-second countdown (cancelable) → `sendSos()` called
3. Location shared + SMS sent to contacts + event logged in DB
4. Success feedback: green snackbar "SOS sent. Contacts notified."

**Status:** ✅ Built — SOS button wired, needs countdown confirmation step added.

---

### 10.2 ContactScreen
**Route:** `emergency_contacts`  
**Purpose:** Manage emergency contacts list.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Emergency Contacts" | ← back. Right: "+" button to add |
| List | `TrainlyFeedLayout` of cards | Each: name (bold) + phone (gray) + ✖ delete icon button |
| Empty | `TrainlyEmpty` | 📞 "No contacts" + "Add Contact" action |
| Dialog | `TrainlyFormDialog` | Name field + Phone field + Save button |

**Mock Contacts:**
| Name | Phone |
|------|-------|
| Sarah Johnson | +1 (555) 123-4567 |
| Mike Chen | +1 (555) 987-6543 |
| Dad | +1 (555) 555-0100 |

**Status:** ✅ Built — fully functional with add/delete.

---

## 11. Achievements

### 11.1 AchievementsScreen
**Route:** `achievements`  
**Purpose:** Gamification — view earned and in-progress achievements.

| Zone | Element | Spec |
|------|---------|------|
| Top bar | "Achievements" | ← back |
| Tab row | 3 tabs | 🏆 Earned / 📈 Progress / 🏆 Leaderboard |
| Earned tab | `TrainlyFeedLayout` | List of `TrainlyListItemCard` — icon + name + description |
| Progress tab | "Coming soon" | In-progress achievements with progress bars |
| Leaderboard tab | "Coming soon" | Global friend leaderboard |

**12 Achievement Definitions:**
| # | Name | Icon | Description | Category | Rarity | Criteria |
|---|------|------|-------------|----------|--------|----------|
| 1 | First Sweat | 💪 | Complete your first workout | milestone | common | 1 workout |
| 2 | Getting Serious | 🎯 | Complete 10 workouts | milestone | common | 10 workouts |
| 3 | Dedicated | ⚡ | Complete 50 workouts | milestone | rare | 50 workouts |
| 4 | Unstoppable | 🔥 | Complete 100 workouts | milestone | epic | 100 workouts |
| 5 | 5K Runner | 🏃 | Run 5km in a single session | distance | common | 5km run |
| 6 | Marathon Ready | 🏅 | Run 42.2km in a single session | distance | legendary | full marathon |
| 7 | Century Ride | 🚴 | Cycle 100km in a single session | distance | epic | 100km cycle |
| 8 | Week Warrior | 📅 | Work out 7 days in a row | consistency | common | 7-day streak |
| 9 | Iron Will | 🔗 | 30-day workout streak | consistency | epic | 30-day streak |
| 10 | Gym Rat | 🏋️ | Complete 20 gym workouts | strength | rare | 20 gym sessions |
| 11 | Speed Demon | ⚡ | Run 5km under 25 minutes | technique | rare | sub-25min 5K |
| 12 | Social Butterfly | 🦋 | Get 50 likes across all posts | social | rare | 50 total likes |

**Mock Earned (for display):**
| Icon | Name | Description |
|------|------|-------------|
| 💪 | First Sweat | Complete your first workout |
| 🎯 | Getting Serious | Complete 10 workouts |
| 🏃 | 5K Runner | Run 5km in a single session |
| 📅 | Week Warrior | Work out 7 days in a row |

**Mock In-Progress (for Progress tab):**
| Icon | Name | Progress |
|------|------|----------|
| ⚡ | Dedicated | 28/50 workouts ████████░░ 56% |
| 🔗 | Iron Will | 12/30 days ████░░░░░░ 40% |
| 🏋️ | Gym Rat | 8/20 sessions ██░░░░░░░░ 40% |

**Status:** ✅ Built — Earned tab functional, Progress & Leaderboard are "Coming soon" stubs.

---

## Summary: Screen Build Status

| Family | Screen | Status |
|--------|--------|--------|
| Onboarding | Slide 1–3 | ❌ Not built |
| Main | MainScreen (Tab Host) | ✅ Built |
| Home | HomeScreen | ✅ Built |
| Stats | StatsScreen | ⚠️ Charts are placeholders |
| Community | CommunityFeedScreen | ✅ Built |
| Profile | ProfileScreen | ✅ Built |
| Workout | TrainingSelectionScreen | ✅ Built |
| Workout | RunningScreen | ✅ Built |
| Workout | CyclingScreen | ✅ Built |
| Workout | SwimmingScreen | ⚠️ Shows GPS map, needs lap counter |
| Workout | GymWorkoutScreen | ⚠️ Add set dialog not wired |
| Workout | WorkoutHistoryScreen | ✅ Built |
| Workout | WorkoutDetailScreen | ⚠️ Needs type-specific sections |
| Social | CreatePostScreen | ✅ Built (text only, no image) |
| Social | CommentScreen | ✅ Built |
| Social | UserProfileScreen | ⚠️ Minimal stub, needs full data |
| Social | FindFriendsScreen | ✅ Built |
| Social | FollowersListScreen | ✅ Built |
| Social | FollowingListScreen | ✅ Built |
| Profile/Settings | SettingsScreen | ✅ Built |
| Profile/Settings | PersonalInfoScreen | ✅ Built |
| Profile/Settings | EditStatsScreen | ✅ Built |
| Emergency | EmergencyServicesScreen | ⚠️ Needs countdown step |
| Emergency | ContactScreen | ✅ Built |
| Achievements | AchievementsScreen | ⚠️ Progress/Leaderboard tabs stubs |

**Greenfield needed:** Onboarding (3 screens).  
**Polish/completion needed:** Stats charts, Swimming lap counter, Gym set dialog, UserProfile data, WorkoutDetail sections, Emergency countdown, Achievements tabs.
