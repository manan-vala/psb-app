import { useRef } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

export interface KeystrokeMetrics {
  meanHoldTime: number;
  meanFlightTime: number;
  typingStdDev: number;
  wpmEstimate: number;
  keypressCount: number;
}

export function useKeystrokeDynamics() {
  const keyPressTimestamps = useRef<number[]>([]);
  const firstKeyPressAt = useRef<number | null>(null);
  const charCount = useRef(0);

  function getInputProps() {
    return {
      onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const now = Date.now();
        if (!firstKeyPressAt.current) firstKeyPressAt.current = now;
        keyPressTimestamps.current.push(now);
        charCount.current++;
      },
    };
  }

  function getMetrics(): KeystrokeMetrics {
    const timestamps = keyPressTimestamps.current;
    const n = timestamps.length;

    const flightTimes = timestamps.slice(1).map((t, i) => t - timestamps[i]);
    const meanFlightTime = flightTimes.length > 0
      ? flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length
      : 0;

    const meanHoldTime = meanFlightTime * 0.8;

    const mean = meanFlightTime;
    const variance = flightTimes.length > 1
      ? flightTimes.reduce((acc, t) => acc + (t - mean) ** 2, 0) / flightTimes.length
      : 0;
    const typingStdDev = Math.sqrt(variance);

    const elapsedMin = firstKeyPressAt.current
      ? (Date.now() - firstKeyPressAt.current) / 60000
      : 1;
    const wpmEstimate = elapsedMin > 0 ? (charCount.current / 5) / elapsedMin : 0;

    return {
      meanHoldTime: Math.round(meanHoldTime),
      meanFlightTime: Math.round(meanFlightTime),
      typingStdDev: Math.round(typingStdDev),
      wpmEstimate: Math.round(wpmEstimate),
      keypressCount: n,
    };
  }

  function reset() {
    keyPressTimestamps.current = [];
    firstKeyPressAt.current = null;
    charCount.current = 0;
  }

  return { getInputProps, getMetrics, reset };
}
