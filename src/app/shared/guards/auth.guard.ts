import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../domain/services/auth.service';
import { AUTH_SERVICE_TOKEN } from '../tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      // Verificar si el usuario está autenticado
      const isAuthenticated = await this.authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Si no está autenticado, redirigir al login
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }

      // Verificar que el usuario actual existe
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) {
        // Si no se puede obtener el usuario actual, redirigir al login
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en AuthGuard:', error);
      // En caso de error, redirigir al login
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }
  }
}
