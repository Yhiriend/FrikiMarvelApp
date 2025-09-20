import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error: any;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: number;
    name: string;
    identification: string;
    email: string;
    lastLogin: string;
  };
}

export interface RegisterRequest {
  name: string;
  identification: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: number;
    name: string;
    identification: string;
    email: string;
    lastLogin: string;
  };
}

class ApiConfig {
  private axiosInstance: AxiosInstance;
  private readonly baseURL: string;
  private readonly tokenKey = 'comicverse_token';

  constructor() {
    this.baseURL = environment.apiUrl;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor para agregar el token automáticamente
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor para manejar errores globales
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          this.removeToken();
          // Opcional: redirigir al login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Métodos HTTP
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  // Métodos específicos para autenticación
  public async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  public async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await this.post<RegisterResponse>('/auth/register', userData);
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  public async logout(): Promise<void> {
    try {
      await this.post('/api/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.removeToken();
    }
  }

  public async getCurrentUser(): Promise<ApiResponse<any>> {
    return await this.get('/api/auth/me');
  }
}

// Instancia singleton
export const apiConfig = new ApiConfig();
