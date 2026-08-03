import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

/**
 * Local, on-device authentication store.
 *
 * This app has no multi-user backend (the server side is a single hardcoded
 * demo user used for the risk-telemetry pipeline — see context/PRD.md).
 * Account creation, password, and PIN are therefore stored securely on the
 * device itself via expo-secure-store (backed by Android Keystore / iOS
 * Keychain), hashed with a per-credential random salt. This keeps the app
 * fully self-contained and offline-capable, consistent with the rest of the
 * app's mocked/demo data.
 */

const KEYS = {
  PROFILE: 'psb_auth_profile',
  PASSWORD_SALT: 'psb_auth_password_salt',
  PASSWORD_HASH: 'psb_auth_password_hash',
  PIN_SALT: 'psb_auth_pin_salt',
  PIN_HASH: 'psb_auth_pin_hash',
  SESSION_ACTIVE: 'psb_auth_session_active',
  BIOMETRIC_ENABLED: 'psb_auth_biometric_enabled',
} as const;

export interface UserProfile {
  fullName: string;
  mobile: string;
  email?: string;
}

async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashWithSalt(value: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${value}`);
}

/** True once the user has created an account (name + password) on this device. */
export async function hasAccount(): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(KEYS.PASSWORD_HASH);
  return hash !== null;
}

/** Creates the local account: stores profile + salted password hash. */
export async function registerAccount(profile: UserProfile, password: string): Promise<void> {
  const salt = await generateSalt();
  const hash = await hashWithSalt(password, salt);
  await SecureStore.setItemAsync(KEYS.PROFILE, JSON.stringify(profile));
  await SecureStore.setItemAsync(KEYS.PASSWORD_SALT, salt);
  await SecureStore.setItemAsync(KEYS.PASSWORD_HASH, hash);
}

/** Checks a password attempt against the stored hash. */
export async function verifyPassword(password: string): Promise<boolean> {
  const [salt, stored] = await Promise.all([
    SecureStore.getItemAsync(KEYS.PASSWORD_SALT),
    SecureStore.getItemAsync(KEYS.PASSWORD_HASH),
  ]);
  if (!salt || !stored) return false;
  const attempt = await hashWithSalt(password, salt);
  return attempt === stored;
}

/** True once the user has set a 4-digit PIN on this device. */
export async function hasPin(): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(KEYS.PIN_HASH);
  return hash !== null;
}

/** Sets (or resets) the local PIN. */
export async function setPin(pin: string): Promise<void> {
  const salt = await generateSalt();
  const hash = await hashWithSalt(pin, salt);
  await SecureStore.setItemAsync(KEYS.PIN_SALT, salt);
  await SecureStore.setItemAsync(KEYS.PIN_HASH, hash);
}

/** Checks a PIN attempt against the stored hash. */
export async function verifyPin(pin: string): Promise<boolean> {
  const [salt, stored] = await Promise.all([
    SecureStore.getItemAsync(KEYS.PIN_SALT),
    SecureStore.getItemAsync(KEYS.PIN_HASH),
  ]);
  if (!salt || !stored) return false;
  const attempt = await hashWithSalt(pin, salt);
  return attempt === stored;
}

/** Returns the locally stored profile, if any. */
export async function getProfile(): Promise<UserProfile | null> {
  const raw = await SecureStore.getItemAsync(KEYS.PROFILE);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

/** Marks whether there's an authenticated session right now. */
export async function setSessionActive(active: boolean): Promise<void> {
  await SecureStore.setItemAsync(KEYS.SESSION_ACTIVE, active ? 'true' : 'false');
}

export async function isSessionActive(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEYS.SESSION_ACTIVE)) === 'true';
}

/** Ends the current session. Account/PIN/password remain on-device for next login. */
export async function logout(): Promise<void> {
  await setSessionActive(false);
}

/** User's preference for whether the biometric login button should be offered. Defaults to on. */
export async function getBiometricPreference(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED);
  return value === null ? true : value === 'true';
}

export async function setBiometricPreference(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
}
