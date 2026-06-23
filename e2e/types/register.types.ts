/**
 * Registration form data used by the Playwright tests.
 *
 * Optional fields are inputs that are not rendered by every project.
 */
export interface RegisterFormData {
  username?: string;
  email?: string;
  password: string;
  referrerCode?: string;
}

export interface ProjectARegisterFormData extends RegisterFormData {
  confirmPassword: string;
  bankAccountName: string;
  address: string;
  phoneNumber: string;
}

export type RegisterTestData = RegisterFormData | ProjectARegisterFormData;

/**
 * Project-specific UI capabilities.
 *
 * Keep project branching centralized in projectConfig and flow factories.
 */
export interface ProjectCapabilities {
  name: string;
  baseURL: string;
  hasPhoneField: boolean;
  requiresOtp: boolean;
  registerFlow: 'standard' | 'otp';
}
