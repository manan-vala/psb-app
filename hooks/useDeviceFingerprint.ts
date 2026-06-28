import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import * as Device from 'expo-device';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const STORE_KEY = 'aegis_device_fingerprint';

async function computeFingerprint(): Promise<string> {
  const { width, height } = Dimensions.get('window');
  const raw = [
    Device.osName,
    Device.modelName,
    Device.totalMemory,
    width,
    height
  ].join('|');
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, raw);
}

export function useDeviceFingerprint() {
  const [fingerprintHash, setFingerprintHash] = useState<string>('');

  useEffect(() => {
    async function init() {
      const stored = await SecureStore.getItemAsync(STORE_KEY);
      if (stored) {
        setFingerprintHash(stored);
        return;
      }
      const hash = await computeFingerprint();
      await SecureStore.setItemAsync(STORE_KEY, hash);
      setFingerprintHash(hash);
    }
    init();
  }, []);

  return { fingerprintHash };
}
