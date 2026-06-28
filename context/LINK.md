# Aegis System Link Guide
**Role:** Instructions to connect all three systems into a unified real-time loop.

## 1. Start the Backend (`psb-back`)
- Ensure your Express/Socket.io server is listening on port `3000`.
- Run: `npx ts-node src/index.ts` (or your chosen dev script).

## 2. Connect the Dashboard (`psb-front`)
- The dashboard runs on your local machine, so `localhost` works perfectly.
- Create `.env` in `psb-front`: `VITE_WS_URL=http://localhost:3000`.
- Run: `npm run dev`. The dashboard should show "Live".

## 3. Connect the Mobile App (`psb-app`)
- **CRITICAL:** Physical phones or Android emulators *cannot* use `localhost` to reach your computer's backend.
- Find your development machine's local IPv4 address (e.g., `192.168.1.5`).
- In `psb-app/services/api.ts`, configure Axios to use this IP:
  ```typescript
  export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || '[http://192.168.1.5:3000](http://192.168.1.5:3000)'
  });