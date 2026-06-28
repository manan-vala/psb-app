import { useRef, useEffect } from 'react';
import { usePathname } from 'expo-router';

interface JourneyEntry {
  screen: string;
  enteredAt: number;
  dwellTime?: number;
}

export function useJourneyTracker() {
  const pathname = usePathname();
  const sessionPath = useRef<string[]>([]);
  const currentEntry = useRef<JourneyEntry | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (currentEntry.current) {
      currentEntry.current.dwellTime = now - currentEntry.current.enteredAt;
    }

    const screenName = pathname.replace('/(app)/', '').replace('/(auth)/', '');
    sessionPath.current.push(screenName);
    currentEntry.current = { screen: screenName, enteredAt: now };
  }, [pathname]);

  function getCurrentJourney() {
    const path = sessionPath.current;
    const n = path.length;

    return {
      currentScreen: path[n - 1] ?? 'unknown',
      previousScreen: path[n - 2] ?? 'none',
      dwellTime: currentEntry.current
        ? Date.now() - currentEntry.current.enteredAt
        : 0,
      sessionPath: [...path],
    };
  }

  function reset() {
    sessionPath.current = [];
    currentEntry.current = null;
  }

  return { getCurrentJourney, reset };
}
