export interface TelemetryPayload {
  userId: string
  sessionId: string
  timestamp: number

  network: {
    lat: number
    lon: number
    rtt: number
    isVpn?: boolean
  }

  device: {
    fingerprintHash: string
    platform: 'android'
    isFirstDevice?: boolean
    isDeviceChanged?: boolean
  }

  behavior: {
    meanHoldTime: number
    meanFlightTime: number
    typingStdDev: number
    wpmEstimate: number
    keypressCount: number
    pasteDetected: boolean
    gyroVariance: number
  }

  journey: {
    currentScreen: string
    previousScreen: string
    dwellTime: number
    sessionPath: string[]
  }
}

export interface RiskAssessment {
  riskScore: number
  action: 'ALLOW' | 'STEP_UP' | 'BLOCK'
  engines: {
    network: number
    device: number
    behavior: number
    journey: number
  }
  flags: string[]
  explanation: string
}
