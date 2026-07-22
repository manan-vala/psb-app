import axios from 'axios';
import { TelemetryPayload, RiskAssessment } from '../types/telemetry';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000',
  timeout: 5000,
});

export async function measureRTT(): Promise<number> {
  const t0 = Date.now();
  try {
    await apiClient.get('/api/ping');
    return Date.now() - t0;
  } catch {
    return 999;
  }
}

export async function submitTelemetry(payload: TelemetryPayload): Promise<RiskAssessment> {
  const { data } = await apiClient.post<RiskAssessment>('/api/assess', payload);
  return data;
}

export async function reportPayment(amount: string, payeeName: string): Promise<void> {
  try {
    await apiClient.post('/api/payment', { amount, payeeName });
  } catch (error) {
    console.error('Failed to report payment:', error);
  }
}
