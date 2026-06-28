# PSB Mobile App (`psb-app`)
**Role:** End-user banking app simulator. Silently collects sensor and behavioral telemetry.

## Current State
- **Stack:** React Native (Expo), `expo-router`, `expo-sensors`, Axios.
- **Status:** Scaffolded. Essential packages installed.

## Necessary Next Steps
1. **Telemetry Hooks:** Implement `useKeystrokeDynamics`, `useGyroscope`, and `useJourneyTracker`.
2. **UI Flow:** Build `login.tsx`, `home.tsx`, and `transfer.tsx`.
3. **API Integration:** Wire the login/transfer buttons to trigger a telemetry payload POST to the backend via Axios.