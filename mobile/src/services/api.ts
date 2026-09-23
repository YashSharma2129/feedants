import { Platform } from 'react-native';
import { ApiResponse, Competition } from '../types/competition';

const PRODUCTION_API_URL = 'https://feedants-backend-gmov.onrender.com/api';

const getApiBaseUrl = (): string => {
  // 1. Explicit environment variable if configured
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. If running in Web browser, check if hosted on public domain (like Vercel)
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.startsWith('192.168.')) {
      return PRODUCTION_API_URL;
    }
    return `http://${host}:5001/api`;
  }

  // 3. Fallback for physical devices / Android
  if (Platform.OS === 'android') {
    return PRODUCTION_API_URL;
  }

  return PRODUCTION_API_URL;
};

const BASE_URL = getApiBaseUrl();

// Consistent local participant ID for testing (stored locally or simulated user profile)
export const CURRENT_PARTICIPANT_ID = 'participant_mobile_user_01';
export const CURRENT_PARTICIPANT_NAME = 'Yash Sharma';
export const CURRENT_PARTICIPANT_EMAIL = 'yash@feedants.com';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Dynamic resolve to handle dynamic window host if on web
    const resolvedBaseUrl =
      Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname
        ? (window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.startsWith('192.168.')
            ? `http://${window.location.hostname}:5001/api`
            : PRODUCTION_API_URL)
        : (process.env.EXPO_PUBLIC_API_URL || this.baseUrl || PRODUCTION_API_URL);

    const url = `${resolvedBaseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-participant-id': CURRENT_PARTICIPANT_ID,
      ...(options.headers as Record<string, string>),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data?.message || data?.error?.details?.[0]?.message || 'An unexpected error occurred';
        const error: any = new Error(errorMsg);
        error.status = response.status;
        error.code = data?.error?.code || 'API_ERROR';
        error.data = data;
        throw error;
      }

      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        const timeoutErr: any = new Error(
          `Request to backend at ${resolvedBaseUrl} timed out. Please check that the server is reachable.`
        );
        timeoutErr.code = 'TIMEOUT_ERROR';
        throw timeoutErr;
      }
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const networkErr: any = new Error(
          `Unable to connect to backend server at ${resolvedBaseUrl}. Please check that the backend is running.`
        );
        networkErr.code = 'NETWORK_ERROR';
        throw networkErr;
      }
      throw err;
    }
  }

  async getCompetition(
    idOrSlug: string = 'feedants-classical-dance',
    participantId: string = CURRENT_PARTICIPANT_ID
  ): Promise<Competition> {
    const res = await this.request<Competition>(
      `/competitions/${idOrSlug}?participantId=${encodeURIComponent(participantId)}`
    );
    return res.data;
  }

  async registerParticipant(
    competitionId: string,
    participantData: {
      participantId?: string;
      participantName?: string;
      participantEmail?: string;
    } = {}
  ): Promise<any> {
    const payload = {
      participantId: participantData.participantId || CURRENT_PARTICIPANT_ID,
      participantName: participantData.participantName || CURRENT_PARTICIPANT_NAME,
      participantEmail: participantData.participantEmail || CURRENT_PARTICIPANT_EMAIL,
    };

    const res = await this.request<any>(`/competitions/${competitionId}/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return res.data;
  }

  async getRegistrationStatus(
    competitionId: string,
    participantId: string = CURRENT_PARTICIPANT_ID
  ): Promise<any> {
    const res = await this.request<any>(
      `/competitions/${competitionId}/registration-status?participantId=${encodeURIComponent(participantId)}`
    );
    return res.data;
  }

  async submitVideoEntry(
    competitionId: string,
    submissionData: {
      mediaUrl: string;
      notes?: string;
      participantId?: string;
    }
  ): Promise<any> {
    const payload = {
      participantId: submissionData.participantId || CURRENT_PARTICIPANT_ID,
      mediaUrl: submissionData.mediaUrl,
      notes: submissionData.notes,
    };

    const res = await this.request<any>(`/competitions/${competitionId}/submission`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return res.data;
  }
}

export const api = new ApiClient(BASE_URL);
