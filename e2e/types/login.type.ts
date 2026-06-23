import { LOGIN_FLOW } from "../constants/constants";

export interface LoginFormData {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginSession {
  jwt: string;
  bearer: string;
  tokenSource: 'localStorage' | 'sessionStorage' | 'cookie';
  tokenKey: string;
}
  
export interface ProjectLoginCapabilities {
  name: string;
  baseURL: string;
  loginFlow: LOGIN_FLOW;
}
