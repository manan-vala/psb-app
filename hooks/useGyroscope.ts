import { useRef, useEffect } from 'react';
import { Gyroscope } from 'expo-sensors';

export function useGyroscope() {
  const readings = useRef<number[]>([]);
  const subscription = useRef<{ remove: () => void } | null>(null);

  function startSampling() {
    readings.current = [];
    Gyroscope.setUpdateInterval(100);
    subscription.current = Gyroscope.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      readings.current.push(magnitude);
    });
  }

  function stopSampling() {
    subscription.current?.remove();
    subscription.current = null;
  }

  function getVariance(): number {
    const data = readings.current;
    if (data.length < 2) return 0;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((acc, v) => acc + (v - mean) ** 2, 0) / data.length;
    return parseFloat(variance.toFixed(6));
  }

  useEffect(() => {
    return () => stopSampling();
  }, []);

  return { startSampling, stopSampling, getVariance };
}
