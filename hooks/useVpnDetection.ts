import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useVpnDetection() {
  const [isVpnActive, setIsVpnActive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    
    async function checkNetwork() {
      try {
        const state = await Network.getNetworkStateAsync();
        if (isMounted) {
          setIsVpnActive(state.type === Network.NetworkStateType.VPN);
        }
      } catch (error) {
        console.warn('Failed to get network state:', error);
      }
    }

    // Initial check
    checkNetwork();

    // Poll every 3 seconds
    const interval = setInterval(checkNetwork, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isVpnActive };
}
