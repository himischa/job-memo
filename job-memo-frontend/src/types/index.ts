export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export interface ApplicationRequest {
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedAt?: string;
  source?: string;
  notes?: string;
}

export interface ApplicationResponse {
  id: number;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedAt?: string;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationSummary {
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';