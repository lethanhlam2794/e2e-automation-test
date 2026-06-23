export interface LoginFormData {
  username?: string;
  email?: string;
  password: string;
}

export interface ProjectLoginCapabilities {
  name: string;
  baseURL: string;
  loginFlow: 'standard';
}