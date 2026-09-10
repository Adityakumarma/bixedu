import { User } from './user.model';
import { Centre } from './centre.model';

export interface LoginResponse {
  token: string;
  user: User;
  centre?: Centre | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  centreName: string;
  centreCode?: string;
  centreEmail?: string;
  centrePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  password?: string;
}

