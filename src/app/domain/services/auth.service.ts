import { User, UserCredentials, UserRegistration } from '../entities/user.entity';

export interface AuthService {
  registerUser(userData: UserRegistration): Promise<User>;
  loginUser(credentials: UserCredentials): Promise<User>;
  logoutUser(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}
