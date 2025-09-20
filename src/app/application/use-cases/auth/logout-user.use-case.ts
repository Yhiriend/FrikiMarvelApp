import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../../../domain/services/auth.service';
import { AUTH_SERVICE_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class LogoutUserUseCase {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private authService: AuthService) {}

  async execute(): Promise<void> {
    await this.authService.logoutUser();
  }
}
