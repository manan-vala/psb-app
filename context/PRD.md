# PRD — Aegis Mobile App
**Project:** Bank of Baroda Hackathon · PSB Identity Trust System
**Scope:** Single Android app (one demo user) + web analyst dashboard

---

## 1. Problem

Banking apps authenticate once at login, then go blind. A stolen session token grants unlimited access. No existing consumer banking app continuously re-evaluates whether the person currently acting is the legitimate account owner.

---

## 2. Solution

Aegis shifts security from **"gate and trust"** to **continuous identity scoring**. Every interaction — how the user types, how they navigate, where they are, what device they're on — is scored in real time. The score drives adaptive friction: normal users feel nothing; attackers get blocked mid-session.

---

## 3. Users

| Actor | Role |
|-------|------|
| **Bank Customer** | Uses the Android app. Single demo user. Logs in, views balance, initiates a transfer. |
| **Fraud Analyst / Judge** | Views the web dashboard. Sees live risk scores, engine breakdowns, alerts, and journey status. |

---

## 4. Mobile App Features

### F1 — Login Screen
- Username + password fields
- **Keystroke dynamics** collected during password entry (hold time, flight time, variance, WPM)
- **Paste detection** — clipboard event on password field instantly flags credential stuffing
- **Gyroscope sampling** during typing — near-zero motion at high WPM signals emulator/RAT
- On submit: telemetry sent to backend; response determines navigation

### F2 — Home Screen
- Mocked account balance display
- Session trust indicator in header (colored dot: green / amber / red)
- Navigation to Transfer

### F3 — Transfer Screen
- Amount input + mocked payee list
- On "Confirm": backend re-assesses risk with journey context
- **Adaptive friction:**
  - Risk < 20 → proceed immediately
  - Risk 20–50 → step-up modal ("Biometric verification required" — mocked success)
  - Risk > 50 → hard block screen with explanation

### F4 — Passive Session Telemetry (always-on)
- Screen transitions logged with timestamps (golden path tracking)
- Dwell time per screen computed
- Device fingerprint hash sent on session start
- RTT measured by pinging backend on each major action

### F5 — Attack Simulation Panel *(demo-only, in Settings)*
- **"Simulate VPN / New Location"** — overrides coordinates sent to backend
- **"Force Paste Flag"** — sets `pasteDetected: true` on next login
- **"Bot Typing Mode"** — sends near-zero variance keystroke data

---

## 5. Web Dashboard Features

### D1 — Live Risk Gauge
- Large 0–100 score, color-coded, updates via WebSocket in real time

### D2 — Engine Sub-scores
- Network / Device / Behavioral / Journey: each 0–100
- Active flags shown as badges (e.g. `VPN_DETECTED`, `PASTE_DETECTED`)

### D3 — Alert Feed
- Chronological list of triggered alerts
- Each entry: timestamp, engine name, flag, brief explanation

### D4 — Journey Timeline
- Live breadcrumb: `Login → Home → Transfer → Confirm`
- Dwell time shown per step
- Anomalous transitions highlighted (e.g. Login → Transfer in < 2s)

### D5 — Session Action Status
- Current decision badge: `ALLOW` / `STEP_UP` / `BLOCK`

---

## 6. What Is Mocked

| Component | Mock |
|-----------|------|
| Biometric / FaceID | Modal that always returns success |
| Core Banking (balance, accounts) | In-memory hardcoded values |
| OTP / SMS gateway | Displayed on-screen as "OTP: 482910" |
| Transaction processing | Always returns "Transfer successful" |
| Multiple users | Single hardcoded demo user |

---

## 7. Success Criteria

| Scenario | Pass Condition |
|----------|---------------|
| Normal login + transfer | Score > 80, dashboard green, transaction allowed |
| Paste credentials | Score < 15, BLOCK triggered, alert on dashboard |
| Simulated VPN / travel | Network score drops, impossible travel alert fires |
| New device fingerprint | Device score drops, `NEW_DEVICE` flag shown |
| Bot typing mode | ML flags anomaly, behavioral score < 20 |
| All scenarios | Dashboard updates within 2 seconds of trigger |
