# TRD — Aegis Mobile App
**Project:** Bank of Baroda Hackathon · PSB Identity Trust System
**Repo baseline:** `psb-app` (Expo ~56.0.12, React 19.2.3, RN 0.85.3)

---

## 1. Repo State (from analysis)

Already installed — no action needed:
```
expo-sensors       gyroscope, accelerometer
expo-clipboard     paste detection
expo-secure-store  session token storage
expo-location      GPS fallback (using IP-geo primarily)
socket.io-client   WebSocket to backend
axios              HTTP calls
@tanstack/react-query  server state management
```

Permissions already declared in `app.json`:
```json
["expo-sensors", { "motionPermission": "Used for security verification" }],
["expo-location", { "locationWhenInUsePermission": "Required for fraud detection" }]
```

Still needs installation:
```bash
npx expo install expo-router expo-crypto expo-device
```

`App.tsx` is a blank scaffold. All screens, hooks, services, and navigation are built from scratch.

---

## 2. System Architecture

```
Android App (Expo ~56)
      │  HTTPS + WebSocket (socket.io)
      ▼
Node.js + Express Backend
  ├── /api/assess      full telemetry in → RiskAssessment out
  ├── /api/journey     screen transition events
  ├── /api/ping        RTT measurement
  ├── Network Engine   → ipinfo.io API
  ├── Device Engine    → fingerprint hash comparison (Redis)
  ├── Behavioral Engine → Python ML microservice (Railway)
  ├── Journey Engine   → path + dwell analysis
  └── Risk Orchestrator → weighted fusion → socket.io broadcast
       │
       ├── Redis        session state, baselines, recent IPs
       └── SQLite/Prisma  audit log, user baseline profile

Python FastAPI ML Service (Railway.app)
  └── /predict         Isolation Forest → behavioral trust score

Web Dashboard (React + Vite + Shadcn)
  └── WebSocket subscriber → live UI updates
```

---

## 3. Shared Type Contract

```typescript
// types/telemetry.ts — copy to all three projects

export interface TelemetryPayload {
  userId: string
  sessionId: string
  timestamp: number

  network: {
    lat: number
    lon: number
    rtt: number             // ms — app pings /api/ping before submitting
  }

  device: {
    fingerprintHash: string // SHA-256(osName|modelName|totalMemory|width|height)
    platform: 'android'
  }

  behavior: {
    meanHoldTime: number    // ms average key held down
    meanFlightTime: number  // ms average between keystrokes
    typingStdDev: number    // ms std deviation (bots ≈ 0)
    wpmEstimate: number     // words per minute
    keypressCount: number
    pasteDetected: boolean
    gyroVariance: number    // magnitude variance during typing
  }

  journey: {
    currentScreen: string
    previousScreen: string
    dwellTime: number       // ms spent on previous screen
    sessionPath: string[]
  }
}

export interface RiskAssessment {
  riskScore: number         // 0–100 (higher = more suspicious)
  action: 'ALLOW' | 'STEP_UP' | 'BLOCK'
  engines: {
    network: number         // trust scores 0–100
    device: number
    behavior: number
    journey: number
  }
  flags: string[]
  explanation: string
}
```

---

## 4. Mobile App

### 4.1 Navigation Structure
Using `expo-router` (file-based, Expo v56 native):
```
app/
  _layout.tsx           root layout, SessionProvider
  (auth)/
    _layout.tsx
    login.tsx           F1 — Login
  (app)/
    _layout.tsx         tab or stack navigator
    home.tsx            F2 — Home
    transfer.tsx        F3 — Transfer
    settings.tsx        F5 — Attack Simulation Panel
```

### 4.2 Key Hooks

**`hooks/useKeystrokeDynamics.ts`**
```typescript
// Attaches to TextInput via onKeyPress + onChange
// Tracks: keydown timestamps, hold durations, inter-key flight times
// Returns: getMetrics() → { meanHoldTime, meanFlightTime, typingStdDev, wpmEstimate, keypressCount }
// Note: RN lacks native onKeyUp — use onChange event delta as flight time approximation
```

**`hooks/useGyroscope.ts`**
```typescript
import { Gyroscope } from 'expo-sensors'
// Subscribe at 100ms intervals during password entry
// Compute variance of sqrt(x²+y²+z²) magnitude readings
// Threshold: variance < 0.002 during typing → gyroVariance = near-zero → emulator signal
// Unsubscribe on field blur / form submit
```

**`hooks/useJourneyTracker.ts`**
```typescript
// Wraps expo-router navigation events
// On each route change: records { screen, timestamp, dwellTime }
// Maintains sessionPath: string[] in component state
// Exposes getCurrentJourney() → journey portion of TelemetryPayload
```

**`hooks/usePasteDetection.ts`**
```typescript
import * as Clipboard from 'expo-clipboard'
// On TextInput focus: snapshot clipboard content
// On onChange: if value jumped by > 4 chars in single event → pasteDetected = true
// Alternative: listen for onChangeText and compare with previous value length delta
```

### 4.3 Device Fingerprint
```typescript
import * as Device from 'expo-device'
import * as Crypto from 'expo-crypto'
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
const raw = [Device.osName, Device.modelName, Device.totalMemory, width, height].join('|')
const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, raw)
```
Computed once on app launch, stored in `expo-secure-store`, sent with every telemetry payload.

### 4.4 RTT Measurement
```typescript
// In services/api.ts
const t0 = Date.now()
await axios.get('/api/ping')
const rtt = Date.now() - t0
// Include rtt in TelemetryPayload.network.rtt
```

### 4.5 Login Submit Flow
```
1. Collect getMetrics() from keystroke hook
2. Collect gyroVariance from gyroscope hook
3. Measure RTT
4. Build TelemetryPayload
5. POST /api/assess
6. Receive RiskAssessment
7. action === 'ALLOW'   → router.push('/(app)/home')
8. action === 'STEP_UP' → show BiometricModal (always resolves true in demo)
9. action === 'BLOCK'   → router.push('/blocked') with explanation
```

---

## 5. Backend

### 5.1 Stack
```
Node.js 22 + Express 5
socket.io 4          WebSocket server + rooms
ioredis              Redis client
@prisma/client       SQLite ORM
axios                ipinfo.io + ML service calls
```

### 5.2 Prisma Schema
```prisma
model UserBaseline {
  id              String   @id @default(cuid())
  userId          String   @unique
  avgHoldTime     Float    @default(80)
  avgFlightTime   Float    @default(120)
  typingStdDev    Float    @default(35)
  knownDeviceHash String?
  lastKnownLat    Float?
  lastKnownLon    Float?
  updatedAt       DateTime @updatedAt
}

model AuditEvent {
  id           String   @id @default(cuid())
  userId       String
  eventType    String
  riskScore    Float
  flags        String   // JSON.stringify(string[])
  engineScores String   // JSON.stringify(engines object)
  createdAt    DateTime @default(now())
}
```

### 5.3 Engine Logic

**Network Engine** (`engines/network.ts`)
```
1. ipinfo.io lookup on req.ip → { lat, lon, org, privacy.vpn }
2. Load lastKnownLat/Lon from Redis key user:{userId}:lastIP
3. Haversine distance / time delta → speed km/h
4. Score deductions:
   - VPN detected:          -40
   - Speed > 800 km/h:      -35  (IMPOSSIBLE_TRAVEL)
   - New ASN / org:         -10  (NEW_NETWORK)
   - RTT > 400ms:           -15  (HIGH_LATENCY)
5. Store current lat/lon in Redis (TTL 30min)
```

**Device Engine** (`engines/device.ts`)
```
1. Load knownDeviceHash from Redis user:{userId}:deviceHash
2. null (first session) → store hash, score 75, flag FIRST_DEVICE
3. Match → score 100
4. Mismatch → score 60, flag NEW_DEVICE_FINGERPRINT
```

**Behavioral Engine** (`engines/behavior.ts`)
```
1. pasteDetected === true → score 5, flag PASTE_DETECTED, skip ML
2. keypressCount < 6 → score 50, flag INSUFFICIENT_KEYSTROKES
3. POST to ML service /predict (2s AbortSignal timeout)
4. On timeout/error → default score 50 (fail open, never block on ML outage)
5. gyroVariance < 0.002 AND wpmEstimate > 80 → additional -20, flag EMULATOR_SUSPECTED
```

**Journey Engine** (`engines/journey.ts`)
```
1. Login → Transfer with dwellTime < 1500ms → -30, flag SPEEDRUN
2. Total session length to Transfer action < 3000ms → -40, flag HEADLESS_NAVIGATION
3. sessionPath skips Home entirely → -15, flag GOLDEN_PATH_DEVIATION
```

**Risk Orchestrator** (`orchestrator.ts`)
```typescript
const riskScore =
  0.30 * (100 - networkScore) +
  0.20 * (100 - deviceScore)  +
  0.30 * (100 - behaviorScore)+
  0.20 * (100 - journeyScore)

const action = riskScore < 20 ? 'ALLOW' : riskScore < 50 ? 'STEP_UP' : 'BLOCK'

// Broadcast to dashboard
io.emit('risk_update', { riskScore, action, engines, flags, sessionPath, explanation, timestamp })

// Persist
await prisma.auditEvent.create({ data: { userId, eventType, riskScore, flags, engineScores } })
```

### 5.4 Redis Key Schema
```
session:{sessionId}:state         last full TelemetryPayload (TTL 30min)
user:{userId}:deviceHash          known fingerprint hash
user:{userId}:lastIP              { lat, lon, asn, ts } of last seen IP
user:{userId}:sessionPath         list of screen names this session
```

---

## 6. ML Microservice

**Stack:** Python 3.11 + FastAPI + scikit-learn + joblib
**Host:** Railway.app (free tier, Nixpacks auto-detect)
**Model:** Isolation Forest trained on synthetic keystroke data

**Input:**
```json
{ "mean_hold_time": 82, "mean_flight_time": 140, "typing_std_dev": 35,
  "wpm_estimate": 65, "keypress_count": 18, "paste_detected": false }
```

**Output:**
```json
{ "is_anomaly": false, "risk_score": 18.4, "behavioral_trust_score": 81.6,
  "confidence": "HIGH", "flags": [] }
```

Hard rules applied before ML:
- `paste_detected` → trust score 5, skip model
- `keypress_count < 6` → trust score 50, `LOW` confidence

Backend timeout: 2000ms via `AbortSignal.timeout(2000)`. On failure, default trust = 50.

---

## 7. Dashboard WebSocket Message

```typescript
// Emitted by backend on every /api/assess and /api/journey call
interface DashboardUpdate {
  riskScore: number
  action: 'ALLOW' | 'STEP_UP' | 'BLOCK'
  engines: { network: number; device: number; behavior: number; journey: number }
  flags: string[]
  sessionPath: string[]
  dwellTimes: number[]
  explanation: string
  timestamp: number
}
```

Dashboard subscribes via `socket.on('risk_update', handler)`.

---

## 8. Environment Variables

```bash
# Backend (.env)
PORT=3000
REDIS_URL=redis://localhost:6379
DATABASE_URL=file:./dev.db
ML_SERVICE_URL=https://aegis-ml-production.up.railway.app
IPINFO_TOKEN=<free from ipinfo.io — 50k req/month>
JWT_SECRET=<32-char random string>

# Dashboard (.env)
VITE_WS_URL=http://localhost:3000

# ML Service — Railway injects PORT automatically
```

---

## 9. Packages to Add to psb-app

```bash
npx expo install expo-router expo-crypto expo-device
```

Update `package.json` main to `"main": "expo-router/entry"` when switching to expo-router.
