import { apiClient } from './api';

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    emailVerificationSent: boolean;
  };
  errors?: string[];
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  alreadyVerified?: boolean;
  expired?: boolean;
  errors?: string[];
}

export interface ResendVerificationData {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

/**
 * Register a new user account
 */
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register', data);
  return response.data;
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
  const response = await apiClient.get<VerifyEmailResponse>(`/auth/verify-email?token=${token}`);
  return response.data;
};

/**
 * Resend verification email
 */
export const resendVerification = async (data: ResendVerificationData): Promise<ResendVerificationResponse> => {
  const response = await apiClient.post<ResendVerificationResponse>('/auth/resend-verification', data);
  return response.data;
};

const authService = {
  register,
  verifyEmail,
  resendVerification
};

export default authService;
