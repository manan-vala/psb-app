import React, { createContext, useContext, ReactNode } from 'react';
import { useKeystrokeDynamics } from '../hooks/useKeystrokeDynamics';
import { usePasteDetection } from '../hooks/usePasteDetection';
import { useGyroscope } from '../hooks/useGyroscope';
import { useDeviceFingerprint } from '../hooks/useDeviceFingerprint';
import { useJourneyTracker } from '../hooks/useJourneyTracker';
import { submitTelemetry as submitTelemetryApi, measureRTT } from '../services/api';
import { RiskAssessment, TelemetryPayload } from '../types/telemetry';

interface TelemetryContextValue {
  keystrokeInputProps: ReturnType<typeof useKeystrokeDynamics>['getInputProps'];
  pasteHandlers: {
    onFocusCapture: () => Promise<void>;
    onChangeTextCapture: (v: string) => void;
  };
  startGyroSampling: () => void;
  stopGyroSampling: () => void;
  submitTelemetry: (userId: string, sessionId: string) => Promise<RiskAssessment>;
  fingerprintHash: string;
}

const TelemetryContext = createContext<TelemetryContextValue | null>(null);

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const keystroke = useKeystrokeDynamics();
  const paste = usePasteDetection();
  const gyro = useGyroscope();
  const { fingerprintHash } = useDeviceFingerprint();
  const journey = useJourneyTracker();

  async function submitTelemetry(userId: string, sessionId: string): Promise<RiskAssessment> {
    const rtt = await measureRTT();
    const behaviorMetrics = keystroke.getMetrics();
    const journeyData = journey.getCurrentJourney();

    const payload: TelemetryPayload = {
      userId,
      sessionId,
      timestamp: Date.now(),
      network: { lat: 0, lon: 0, rtt },
      device: { fingerprintHash, platform: 'android' },
      behavior: {
        ...behaviorMetrics,
        pasteDetected: paste.isPasteDetected(),
        gyroVariance: gyro.getVariance(),
      },
      journey: journeyData,
    };

    return submitTelemetryApi(payload);
  }

  const value: TelemetryContextValue = {
    keystrokeInputProps: keystroke.getInputProps,
    pasteHandlers: {
      onFocusCapture: paste.onFocusCapture,
      onChangeTextCapture: paste.onChangeTextCapture,
    },
    startGyroSampling: gyro.startSampling,
    stopGyroSampling: gyro.stopSampling,
    submitTelemetry,
    fingerprintHash,
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}
