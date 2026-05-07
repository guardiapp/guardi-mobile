import { Apartment, Building } from './reservations.state';

export interface AuthState {
  apartment: Apartment | null;
  token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

export interface LoginResponse {
  apartment: Apartment;
  user: User;
  token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  type: string;
  avatar: null;
  refresh_token: string;
  created_at: string;
  updated_at: string;
  guard: Guard;
}

export interface Guard {
  id: number;
  user_id: number;
  residence_id: number;
  document: string;
  first_name: string;
  last_name: string;
  phone: string;
  active: number;
  created_at: string;
  updated_at: string;
  device_phone: string;
}
