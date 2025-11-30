# Trainly Refactoring Plan

## Overview
Break down files over 300 lines into smaller, maintainable modules (target: <150 lines per file).

## Implementation Priority

1. **Phase 0: Critical Fixes** (Security, Bugs, Code Quality) - Do first
2. **Phase 1-5: Large File Refactoring** (Files >800 lines) - High impact
3. **Phase 6: Shared Components** - Reusable code
4. **Phase 7: Services Refactoring** - API consolidation
5. **Phase 8: PWA Implementation** - Feature addition

## Files Requiring Refactoring (Priority Order)

### 🔴 Critical (>800 lines)
1. **HomeScreen.js** (1,248 lines)
2. **StatsScreen.js** (1,100 lines)
3. **ProfileScreen.js** (863 lines)
4. **CyclingScreen.js** (845 lines)
5. **WorkoutTab.js** (825 lines)

### 🟡 High Priority (500-800 lines)
6. **PersonalInfoScreen.js** (764 lines)
7. **RunningTracker.js** (759 lines)
8. **EmergencyServicesScreen.js** (735 lines)
9. **SwimmingScreen.js** (714 lines)
10. **GymWorkoutScreen.js** (712 lines)
11. **WorkoutHistoryScreen.js** (704 lines)
12. **RunningScreen.js** (691 lines)
13. **CyclingTracker.js** (671 lines)
14. **AchievementsScreen.js** (669 lines)

### 🟢 Medium Priority (300-500 lines)
15. **userProfileScreen.js** (600 lines)
16. **ActivityRouter.js** (566 lines)
17. **SettingsScreen.js** (554 lines)
18. **MainComponent.js** (518 lines)
19. **api.js** (509 lines)

---

## Critical Issues & Fixes

### ⚠️ Security Issues

> **NOTE**: API keys in `app.json` (lines 78, 112) are to remain hardcoded per requirements. Do not change them.

**Step 0.1: Use Environment Variables for API URLs**
- Create `.env` file (add to `.gitignore`)
- Move API URLs from hardcoded strings to env vars
- Update: `services/api.js`, `utils/authUtils.js`, `screens/HomeScreen.js`
- **DO NOT CHANGE**: API keys in `app.json` (leave as is per requirements)
- **Verify**: App connects to correct API endpoints

**Step 0.2: Use SecureStore for Tokens**
- Replace AsyncStorage with `expo-secure-store` for tokens
- Update: `context/AuthContext.js`, `services/api.js`
- Keep AsyncStorage for non-sensitive data only
- **Verify**: Tokens stored securely, auth still works

**Step 0.3: Fix Network Security**
- Remove `NSAllowsArbitraryLoads: true` from `app.json`
- Add specific domain exceptions if needed
- **Verify**: App works with HTTPS only

---

### 🐛 Code Quality Fixes

**Step 0.4: Consolidate API Clients**
- Remove duplicate axios instance from `utils/authUtils.js`
- Use single `apiClient` from `services/api.js` everywhere
- Standardize token storage keys (use `token` not `accessToken`)
- **Verify**: All API calls work correctly

**Step 0.5: Fix useEffect Dependencies**
- Fix `App.js` line 174: Add missing dependencies
- Fix `AuthScreen.js` line 49: Add `onAuthSuccess` to deps
- **Verify**: No stale closures, no infinite loops

**Step 0.6: Standardize Error Handling**
- Create `utils/errorHandler.js` with consistent error format
- All API errors return `{ success: false, message: string }`
- Remove mixed error formats
- **Verify**: Error handling consistent across app

**Step 0.7: Remove/Replace Console Logs**
- Create `utils/logger.js` with dev/prod gates
- Replace 547 console statements with logger
- **Verify**: No console logs in production builds

---

### 🔧 State Management Fixes

**Step 0.8: Remove Global Variables**
- Move `global.onLogout` to AuthContext
- Move `global.getSafeImageUri` to `utils/imageUtils.js`
- Remove global state pollution
- **Verify**: No global dependencies

**Step 0.9: Fix AsyncStorage Corruption**
- Investigate root cause of corruption
- Simplify cleanup logic in `App.js` and `AuthContext.js`
- Remove numeric key detection workarounds
- **Verify**: No more corruption issues

**Step 0.10: Consolidate Auth State**
- Single source of truth: AuthContext only
- Remove redundant AsyncStorage checks
- **Verify**: Auth state consistent

---

### ⚡ Performance Fixes

**Step 0.11: Extract and Memoize Logo**
- Move Logo from `AuthScreen.js` to `components/common/Logo.js`
- Wrap with `React.memo`
- **Verify**: No unnecessary re-renders

**Step 0.12: Add Memoization**
- Add `useMemo` for expensive calculations
- Add `useCallback` for event handlers passed as props
- Focus on: HomeScreen, StatsScreen, ProfileScreen
- **Verify**: Performance improved

**Step 0.13: Fix Timer Cleanup**
- Ensure all intervals cleared in tracker cleanup
- Add guards to prevent memory leaks
- **Verify**: No memory leaks

---

### 🎯 Functionality Fixes

**Step 0.14: Remove or Implement Social Login**
- Either implement Google/Apple login handlers
- Or remove non-functional buttons from `AuthScreen.js`
- **Verify**: No broken UI elements

**Step 0.15: Remove Unused Dependencies**
- Remove Redux/Redux Toolkit (not used)
- Remove `utils/authUtils.js` duplicate code
- **Verify**: Bundle size reduced

**Step 0.16: Fix Fallback Data**
- Remove fake data from `userService.getUserById`
- Show proper error message instead
- **Verify**: No misleading UX

**Step 0.17: Standardize API Endpoints**
- Use consistent `/api/` prefix everywhere
- Fix token refresh endpoint inconsistency
- **Verify**: All endpoints work

**Step 0.18: Add Error Boundaries**
- Create `components/common/ErrorBoundary.js`
- Wrap main app sections
- **Verify**: Errors caught gracefully

---

### 📝 Configuration Fixes

**Step 0.19: Fix Theme Inconsistencies**
- Remove unused `theme.js` import from `App.js`
- Use only `ThemeContext.js` for theming
- **Verify**: Theme consistent

**Step 0.20: Remove Duplicate Permissions**
- Clean up duplicate Android permissions in `app.json`
- **Verify**: Permissions correct

**Step 0.21: Improve Password Validation**
- Increase min length from 6 to 8 characters
- Add strength requirements
- **Verify**: Better security

**Step 0.22: Remove Artificial Delays**
- Remove 3-second delay from `App.js` line 162
- Use actual loading states
- **Verify**: Faster app startup

---

## Step-by-Step Refactoring Plan

### Phase 1: HomeScreen.js (1,248 lines) - HIGHEST PRIORITY

**Step 1.1: Extract PostCard Component**
- Create `components/social/PostCard.js`
- Move PostCard component and related helpers (lines ~92-200)
- Extract `getSafeImageUri`, `getUserIdFromPost`, `formatDate`, `getUserName`
- **Verify**: HomeScreen renders posts correctly

**Step 1.2: Extract ProgressCard Component**
- Create `components/home/ProgressCard.js`
- Move progress display logic (lines ~250-350)
- **Verify**: Progress stats display correctly

**Step 1.3: Extract WorkoutSummary Component**
- Create `components/home/WorkoutSummary.js`
- Move recent workouts display (lines ~400-500)
- **Verify**: Workout list displays correctly

**Step 1.4: Extract FeedSection Component**
- Create `components/social/FeedSection.js`
- Move feed rendering logic (lines ~600-800)
- **Verify**: Social feed loads and displays

**Step 1.5: Extract Custom Hooks**
- Create `hooks/useHomeScreen.js`
- Move state management and API calls
- **Verify**: All functionality preserved

**Step 1.6: Extract Utility Functions**
- Create `utils/homeScreenUtils.js`
- Move helper functions (image handling, date formatting)
- **Verify**: No functionality broken

---

### Phase 2: StatsScreen.js (1,100 lines)

**Step 2.1: Extract Chart Components**
- Create `components/stats/StatsChart.js`
- Create `components/stats/ProgressChart.js`
- Move chart rendering logic
- **Verify**: Charts render correctly

**Step 2.2: Extract Stats Cards**
- Create `components/stats/StatCard.js`
- Create `components/stats/ActivityCard.js`
- Move card components
- **Verify**: Stats display correctly

**Step 2.3: Extract Stats Logic**
- Create `hooks/useStatsScreen.js`
- Move data fetching and calculations
- **Verify**: Stats calculations accurate

---

### Phase 3: ProfileScreen.js (863 lines)

**Step 3.1: Extract Profile Header**
- Create `components/profile/ProfileHeader.js`
- Move header section (avatar, name, bio)
- **Verify**: Profile header displays

**Step 3.2: Extract Stats Section**
- Create `components/profile/ProfileStats.js`
- Move stats display
- **Verify**: Stats show correctly

**Step 3.3: Extract Tab Components**
- Create `components/profile/ProfileTabs.js`
- Move tab navigation logic
- **Verify**: Tabs work correctly

---

### Phase 4: CyclingScreen.js (845 lines)

**Step 4.1: Extract Tracker Display**
- Create `components/training/CyclingDisplay.js`
- Move UI rendering logic
- **Verify**: Display updates correctly

**Step 4.2: Extract Controls**
- Create `components/training/CyclingControls.js`
- Move button handlers
- **Verify**: Controls function properly

**Step 4.3: Extract Stats Panel**
- Create `components/training/CyclingStats.js`
- Move stats calculation/display
- **Verify**: Stats accurate

---

### Phase 5: WorkoutTab.js (825 lines)

**Step 5.1: Extract Exercise List**
- Create `components/gym/ExerciseList.js`
- Move exercise rendering
- **Verify**: Exercises display

**Step 5.2: Extract Exercise Form**
- Create `components/gym/ExerciseForm.js`
- Move form logic
- **Verify**: Form works

**Step 5.3: Extract Workout Logic**
- Create `hooks/useWorkoutTab.js`
- Move state management
- **Verify**: Workout saves correctly

---

### Phase 6: Shared Components & Utilities

**Step 6.1: Create Shared UI Components**
- `components/common/Button.js`
- `components/common/Card.js`
- `components/common/Input.js`
- Extract reusable UI elements

**Step 6.2: Create Shared Hooks**
- `hooks/useNetworkStatus.js` (using NetInfo)
- `hooks/useAuth.js` (already exists, verify usage)
- `hooks/useTheme.js` (already exists, verify usage)

**Step 6.3: Create Utility Modules**
- `utils/dateUtils.js` - date formatting
- `utils/imageUtils.js` - image handling (exists, expand)
- `utils/validation.js` - form validation

---

### Phase 7: Services Refactoring

**Step 7.1: Split api.js (509 lines)**
- `services/authService.js` - auth endpoints
- `services/userService.js` - user endpoints
- `services/postService.js` - post endpoints
- `services/workoutService.js` - workout endpoints
- Keep `api.js` as base client only

**Step 7.2: Extract API Utilities**
- `utils/apiHelpers.js` - request/response helpers
- `utils/errorHandler.js` - centralized error handling

---

### Phase 8: PWA Implementation

**Step 8.1: Add Web Manifest**
- Update `app.json` with web manifest config
- Add icons and theme colors

**Step 8.2: Create Service Worker**
- `public/sw.js` - basic offline caching
- Register in `App.js` (web only)

**Step 8.3: Implement Network Detection**
- Use `@react-native-community/netinfo`
- Add offline indicator component
- Queue failed requests

**Step 8.4: Add Install Prompt**
- `components/common/InstallPrompt.js`
- Show on web platform only

---

## Verification Checklist (After Each Step)

- [ ] App builds without errors
- [ ] Original functionality preserved
- [ ] No console errors
- [ ] File size < 150 lines (where applicable)
- [ ] Single responsibility per file
- [ ] Proper imports/exports
- [ ] Git commit with clear message

---

## Git Workflow

```bash
# For each step:
git checkout -b refactor/step-X.X-description
# Make changes
# Test thoroughly
git add .
git commit -m "refactor: Step X.X - [description]"
git push origin refactor/step-X.X-description
# Create PR, review, merge
```

---

## Quick Wins (Do First)

### Critical Fixes (Do Immediately)
1. Fix useEffect dependencies (Step 0.5) - Prevents bugs
2. Consolidate API clients (Step 0.4) - Reduces complexity
3. Use SecureStore for tokens (Step 0.2) - Security improvement
4. Remove console logs (Step 0.7) - Production ready

### Refactoring Quick Wins
1. Extract `PostCard` from HomeScreen (Step 1.1)
2. Extract `StatCard` from StatsScreen (Step 2.2)
3. Split `api.js` services (Step 7.1)
4. Create shared `Button` component (Step 6.1)

---

## Notes

- Keep original files until new structure is verified
- One refactoring step per commit
- Test after each step
- Update imports as you go
- Document new file purposes with JSDoc comments

