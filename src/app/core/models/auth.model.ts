export interface RegisterRequest {
  Username: string;
  Email: string;
  Password: string;
}

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthenticatedUser;
}
