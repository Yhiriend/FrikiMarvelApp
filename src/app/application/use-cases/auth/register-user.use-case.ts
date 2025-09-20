import { Injectable, Inject } from '@angular/core';
import { User, UserRegistration } from '../../../domain/entities/user.entity';
import { AuthService } from '../../../domain/services/auth.service';
import { AUTH_SERVICE_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserUseCase {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService
  ) {}

  async execute(userData: UserRegistration): Promise<User> {
    this.validateUserData(userData);

    return await this.authService.registerUser(userData);
  }

  private validateUserData(userData: UserRegistration): void {
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (!userData.identification || userData.identification.trim().length === 0) {
      throw new Error('Identification is required');
    }
    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw new Error('Valid email is required');
    }
    if (!userData.password || userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
