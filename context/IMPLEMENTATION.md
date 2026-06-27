# Implementation Plan — Demo Mobile App
**Starting point:** `psb-app` — Expo ~56, blank `App.tsx`, all sensor packages installed

---

## Pre-flight (Before Clock Starts)

```bash
# In psb-app
npx expo install expo-router expo-crypto expo-device

# In package.json — change "main"
"main": "expo-router/entry"
```

Get free token: https://ipinfo.io/signup — paste into backend `.env`.

---

## Phase 1 — The Core Loop (Hours 1–5)
**Goal:** App → Backend → Dashboard pipeline working with fake scores. Do not move on until the gauge moves when you tap login.

### Hour 1–2: Backend scaffold + hardcoded `/api/assess`
- `src/index.ts` — Express + socket.io on port 3000, CORS open
- `src/routes/assess.ts` — accept any POST body, return hardcoded `RiskAssessment`, emit via `io.emit('risk_update', ...)`
- `src/routes/ping.ts` — returns `200 OK` immediately (RTT endpoint)
- Run: `npx ts-node src/index.ts`

### Hour 2–3: Dashboard WebSocket + UI skeleton
Build in this exact order (each depends on the previous):
1. `hooks/useWebSocket.ts` — connect to backend, expose `lastUpdate` state
2. `<RiskGauge />` — big colored number (Recharts RadialBarChart later, plain `<Text>` first)
3. `<EngineScores />` — 4 progress bars with Shadcn `<Progress />`
4. `<AlertFeed />` — array rendered as `<ul>`, newest first
5. `<JourneyTimeline />` — `sessionPath` as horizontal steps

Verify: backend emits → dashboard number changes. Screenshot this. It's your safety net.

### Hour 3–4: App login screen + dummy telemetry
- Create `app/(auth)/login.tsx` with two `TextInput` fields + button
- On press: POST `/api/assess` with all-zero telemetry payload
- Log `RiskAssessment` response to console
- Navigate to `/(app)/home` on `ALLOW`

### Hour 4–5: Verify full loop
App tap → backend log → dashboard gauge moves. **Stop here and confirm this before Phase 2.**

---

## Phase 2 — Real Signals (Hours 5–13)

### Hour 5–6: Keystroke dynamics hook
- Create `hooks/useKeystrokeDynamics.ts`
- `onKeyPress` records `{ key, downAt: Date.now() }`
- `onChange` records `Date.now()` as approx keyUp, computes hold + flight
- `getMetrics()` computes mean, stddev, WPM
- Attach to password `TextInput`. Console-log output on submit. Verify numbers are realistic (hold: 60–120ms, flight: 80–200ms).

### Hour 6–7: Paste detection + gyroscope
**Paste:**
```typescript
// Track value length before/after onChange
// If delta > 4 chars in a single event → pasteDetected = true
```
**Gyroscope:**
```typescript
import { Gyroscope } from 'expo-sensors'
// Subscribe at setUpdateInterval(100) on field focus
// Collect 10+ readings, compute variance of magnitude
// Unsubscribe on blur/submit
```
Test: Type normally → gyroVariance should be > 0.01. Hold phone still → near-zero.

### Hour 7–8: ML microservice
In `aegis-ml/`:
```bash
pip install fastapi uvicorn scikit-learn numpy pandas joblib
python data/generate.py    # synthetic dataset
python train/train.py      # trains + saves model.pkl
uvicorn api.main:app --reload   # test locally first
```
Call `/predict` with bot-like data (stddev=1.5, wpm=220) → confirm `is_anomaly: true`.

Deploy:
```bash
npm install -g @railway/cli
railway login && railway init && railway up
```
Paste Railway URL into backend `.env` as `ML_SERVICE_URL`.

### Hour 8–9: IP geolocation + impossible travel
In `engines/network.ts`:
```typescript
const info = await axios.get(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`)
// Parse lat/lon from info.data.loc ("19.0760,72.8777")
// Load previous from Redis user:{userId}:lastIP
// Haversine(prev, current) / timeDelta → speed
// Apply score deductions, store current in Redis
```
**Simulate impossible travel:** Attack panel sets `network.lat/lon` to Delhi coords while user is "in Mumbai".

### Hour 9–10: Device fingerprint engine
App side:
```typescript
// hooks/useDeviceFingerprint.ts
// Compute SHA-256 on first launch, cache in expo-secure-store
// Return hash on every subsequent launch (no recompute)
```
Backend side:
```typescript
// engines/device.ts
// Redis GET user:{userId}:deviceHash
// null → SET it, score 75 (first login, slightly uncertain)
// match → score 100
// mismatch → score 60, flag NEW_DEVICE_FINGERPRINT
```

### Hour 10–11: Journey tracking
App side:
```typescript
// hooks/useJourneyTracker.ts
// Listen to expo-router navigation events via usePathname() + useEffect
// Track [ { screen, enteredAt } ] in ref
// On each change: compute dwellTime = Date.now() - lastEnteredAt
// POST /api/journey on every transition
```
Backend side:
```typescript
// engines/journey.ts
// Pull sessionPath from Redis user:{userId}:sessionPath
// Check: Login→Transfer skip (SPEEDRUN), total time < 3s (HEADLESS_NAVIGATION)
```

### Hour 11–13: Replace hardcoded scores with real engine calls
Wire all four engines into the orchestrator. Remove hardcoded return values from `/api/assess`. Weighted fusion:
```typescript
const riskScore =
  0.30 * (100 - networkScore) +
  0.20 * (100 - deviceScore)  +
  0.30 * (100 - behaviorScore)+
  0.20 * (100 - journeyScore)
```
Run all 5 demo scenarios manually. Fix anything that gives wrong output.

---

## Phase 3 — App Response Logic (Hours 13–16)

### Hour 13–14: Adaptive friction in app
```typescript
// After POST /api/assess:
if (result.action === 'ALLOW')    router.push('/(app)/home')
if (result.action === 'STEP_UP')  setShowBiometricModal(true)
if (result.action === 'BLOCK')    router.push('/blocked')
```
Biometric modal: Shadcn `<Dialog>` with a fingerprint icon + 1.5s fake processing → always resolves success.
Block screen: red background, `result.explanation` text, "Contact support" button (no-op).

### Hour 14–15: Transfer screen
- Amount `TextInput` + static payee list (3 mocked names)
- On "Confirm Transfer": POST `/api/assess` with updated journey (now includes Transfer screen)
- Backend re-assesses and may upgrade action to STEP_UP or BLOCK based on journey anomaly

### Hour 15–16: Attack simulation panel (Settings screen)
Three toggles stored in `AsyncStorage`:
- `overrideLocation` → app sends Delhi coordinates (28.6139, 77.2090) instead of real location
- `forcePaste` → sets `pasteDetected: true` on next login attempt
- `botTypingMode` → `getMetrics()` returns `{ meanHoldTime: 48, meanFlightTime: 65, typingStdDev: 1.8, wpmEstimate: 220 }`

Each toggle fires immediately when enabled and sends a journey event so dashboard updates live.

---

## Phase 4 — Polish (Hours 16–21)

### Hour 16–18: Dashboard polish
- `<RiskGauge />` → upgrade from plain number to Recharts `RadialBarChart`
- `<AlertFeed />` → color-coded badges per engine (red=Network, orange=Device, purple=Behavior, blue=Journey)
- `<JourneyTimeline />` → horizontal stepper, anomalous steps highlighted in red
- `<SessionStatus />` → top-right pill badge: `ALLOW` (green) / `STEP_UP` (amber) / `BLOCK` (red)
- Auto-scroll alert feed to newest

### Hour 18–20: App polish
- Session trust dot in Home screen header
- Loading spinner during `/api/assess` call (it takes 200–500ms with ML)
- Smooth page transitions (expo-router default transitions are fine)
- Error state if backend unreachable ("Service temporarily unavailable")

### Hour 20–21: Demo data seeding
Create a seed script `prisma/seed.ts`:
```typescript
// Insert demo user baseline:
// avgHoldTime: 78, avgFlightTime: 135, typingStdDev: 32
// knownDeviceHash: hash of your actual test phone
// lastKnownLat: 26.1445 (IIT Guwahati), lastKnownLon: 91.6916
```
Run: `npx ts-node prisma/seed.ts`
Pre-populate Redis with same values via a startup script in `src/index.ts`.

---

## Phase 5 — Demo Rehearsal (Hours 21–24)

Run each scenario 3 times end-to-end. Fix anything that breaks under demo conditions.

| # | Scenario | How to Trigger | Expected Dashboard |
|---|----------|---------------|--------------------|
| 1 | Clean login + transfer | Type normally, no toggles | Score > 80, all green |
| 2 | Paste attack | Toggle `forcePaste` ON → login | Score < 15, BLOCK, `PASTE_DETECTED` alert |
| 3 | Impossible travel | Toggle `overrideLocation` ON | Network drops, `IMPOSSIBLE_TRAVEL` fires |
| 4 | New device | Change one field in fingerprint (restart with env override) | `NEW_DEVICE_FINGERPRINT` flag |
| 5 | Bot typing | Toggle `botTypingMode` ON → login | ML returns anomaly, behavioral < 20 |

**6-minute demo script:**
- Min 0–1: Scenario 1 (baseline — everything green)
- Min 1–3: Scenario 2 (paste — most dramatic, easiest to see)
- Min 3–5: Scenario 3 (impossible travel — map visual)
- Min 5–6: Show audit log on dashboard (all events logged with reasoning)

---

## Priority Triage (If Running Out of Time)

| Priority | Feature | Drop impact |
|----------|---------|-------------|
| P0 | WebSocket pipeline | Dashboard dies without it |
| P0 | Paste detection | Your best demo moment |
| P0 | `/api/assess` → correct action in app | App can't navigate |
| P1 | IP geolocation + impossible travel | Second-best visual |
| P1 | ML service deployed | Behavioral engine needs it |
| P2 | Keystroke hook | Paste covers the story if this breaks |
| P2 | Journey tracking | Good depth, not blockers |
| P3 | Gyroscope | Drop freely |
| P3 | Device fingerprint | Drop freely |

---

## Common Failure Points & Fixes

| Problem | Fix |
|---------|-----|
| CORS blocking app → backend | `app.use(cors({ origin: '*' }))` in Express |
| Railway ML cold start (3s) | `AbortSignal.timeout(3000)`, spinner in app, default to 50 on timeout |
| ipinfo.io returns wrong IP (localhost) | Add `X-Forwarded-For` mock header in dev; test impossible travel via attack panel |
| WebSocket not updating dashboard | Verify `io.emit` fires *after* `prisma.create`; check event name matches on client |
| Expo TextInput no onKeyUp | Use `onChange` delta timing — accuracy is sufficient for anomaly detection |
| expo-router not resolving | Confirm `"main": "expo-router/entry"` in package.json |

---

## Final File Structure

```
psb-app/                          (existing Expo repo)
  app/
    _layout.tsx
    (auth)/login.tsx
    (app)/home.tsx
    (app)/transfer.tsx
    (app)/settings.tsx            attack simulation panel
  hooks/
    useKeystrokeDynamics.ts
    useGyroscope.ts
    useJourneyTracker.ts
    useDeviceFingerprint.ts
  services/api.ts                 all backend calls
  types/telemetry.ts              shared contract

aegis-backend/
  src/
    index.ts                      Express + socket.io
    routes/assess.ts
    routes/journey.ts
    routes/ping.ts
    engines/network.ts
    engines/device.ts
    engines/behavior.ts
    engines/journey.ts
    orchestrator.ts
    redis.ts
  prisma/schema.prisma
  prisma/seed.ts
  .env

aegis-dashboard/
  src/
    components/
      RiskGauge.tsx
      EngineScores.tsx
      AlertFeed.tsx
      JourneyTimeline.tsx
      SessionStatus.tsx
    hooks/useWebSocket.ts
    App.tsx
  .env

aegis-ml/
  data/generate.py
  train/train.py
  api/main.py
  api/model.py
  api/schemas.py
  models/keystroke_model.pkl
  requirements.txt
  Procfile
```
