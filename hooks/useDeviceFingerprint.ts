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
  const [isFirstDevice, setIsFirstDevice] = useState<boolean>(false);
  const [isDeviceChanged, setIsDeviceChanged] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      const stored = await SecureStore.getItemAsync(STORE_KEY);
      const currentHash = await computeFingerprint();
      
      if (!stored) {
        // First time opening the app on this device
        setIsFirstDevice(true);
        await SecureStore.setItemAsync(STORE_KEY, currentHash);
        setFingerprintHash(currentHash);
      } else {
        // Not the first time. Has the hardware profile changed?
        setIsFirstDevice(false);
        if (stored !== currentHash) {
          setIsDeviceChanged(true);
          // Optionally update the store to the new hash, or keep the original for persistent flagging
          await SecureStore.setItemAsync(STORE_KEY, currentHash);
        } else {
          setIsDeviceChanged(false);
        }
        setFingerprintHash(currentHash);
      }
    }
    init();
  }, []);

  return { fingerprintHash, isFirstDevice, isDeviceChanged };
}
