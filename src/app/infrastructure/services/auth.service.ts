import { Injectable } from '@angular/core';
import { User, UserCredentials, UserRegistration } from '../../domain/entities/user.entity';
import { AuthService as IAuthService } from '../../domain/services/auth.service';
import { apiConfig, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceImpl implements IAuthService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'comicverse_user';
  private readonly REFRESH_TOKEN_KEY = 'comicverse_refresh_token';
  private readonly EXPIRES_AT_KEY = 'comicverse_expires_at';

  constructor() {
    this.loadUserFromStorage();
  }

  async registerUser(userData: UserRegistration): Promise<User> {
    try {
      const registerRequest: RegisterRequest = {
        name: userData.name,
        identification: userData.identification,
        email: userData.email,
        password: userData.password
      };

      const response = await apiConfig.register(registerRequest);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      const user: User = {
        id: response.data.user.id,
        name: response.data.user.name,
        identification: response.data.user.identification,
        email: response.data.user.email,
        password: '', // No guardamos la contraseña en el cliente
        lastLogin: new Date(response.data.user.lastLogin)
      };

      this.currentUser = user;
      this.saveUserToStorage();
      this.saveTokens(response.data.token, response.data.refreshToken, response.data.expiresAt);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  async loginUser(credentials: UserCredentials): Promise<User> {
    try {
      const loginRequest: LoginRequest = {
        email: credentials.email,
        password: credentials.password
      };

      const response = await apiConfig.login(loginRequest);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const user: User = {
        id: response.data.user.id,
        name: response.data.user.name,
        identification: response.data.user.identification,
        email: response.data.user.email,
        password: '', // No guardamos la contraseña en el cliente
        lastLogin: new Date(response.data.user.lastLogin)
      };

      this.currentUser = user;
      this.saveUserToStorage();
      this.saveTokens(response.data.token, response.data.refreshToken, response.data.expiresAt);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await apiConfig.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.currentUser = null;
      this.clearAllTokens();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Si no hay usuario en memoria, intentar obtenerlo de la API
    if (apiConfig.isAuthenticated()) {
      try {
        const response = await apiConfig.getCurrentUser();
        if (response.success) {
          const user: User = {
            id: response.data.id,
            name: response.data.name,
            identification: response.data.identification,
            email: response.data.email,
            password: '',
            lastLogin: new Date(response.data.lastLogin)
          };
          this.currentUser = user;
          this.saveUserToStorage();
          return user;
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        // Si hay error, limpiar el token
        apiConfig.removeToken();
        this.currentUser = null;
        this.clearAllTokens();
      }
    }

    return null;
  }

  async isAuthenticated(): Promise<boolean> {
    return apiConfig.isAuthenticated() && this.currentUser !== null;
  }

  async hashPassword(password: string): Promise<string> {
    // En una aplicación real, el hash se hace en el servidor
    // Este método se mantiene por compatibilidad pero no se usa
    throw new Error('Password hashing should be done on the server');
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // En una aplicación real, la verificación se hace en el servidor
    // Este método se mantiene por compatibilidad pero no se usa
    throw new Error('Password verification should be done on the server');
  }

  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.currentUser = null;
    }
  }

  private saveUserToStorage(): void {
    try {
      if (this.currentUser) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  private saveTokens(token: string, refreshToken: string, expiresAt: string): void {
    try {
      apiConfig.setToken(token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt);
    } catch (error) {
      console.error('Error saving tokens to storage:', error);
    }
  }

  private clearAllTokens(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.EXPIRES_AT_KEY);
      apiConfig.removeToken();
    } catch (error) {
      console.error('Error clearing tokens from storage:', error);
    }
  }
}
