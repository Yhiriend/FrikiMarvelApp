import { Injectable, Inject } from '@angular/core';
import { User, UserCredentials } from '../../../domain/entities/user.entity';
import { AuthService } from '../../../domain/services/auth.service';
import { AUTH_SERVICE_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class LoginUserUseCase {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService
  ) {}

  async execute(credentials: UserCredentials): Promise<User> {
    this.validateCredentials(credentials);

    return await this.authService.loginUser(credentials);
  }

  private validateCredentials(credentials: UserCredentials): void {
    if (!credentials.email || !this.isValidEmail(credentials.email)) {
      throw new Error('Valid email is required');
    }
    if (!credentials.password || credentials.password.length === 0) {
      throw new Error('Password is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
