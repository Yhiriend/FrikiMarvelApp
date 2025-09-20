import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // Duración en milisegundos, por defecto 5000ms
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$: Observable<ToastMessage[]> = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addToast(toast: ToastMessage): void {
    const currentToasts = this.toastsSubject.value;
    
    // Pequeño delay para asegurar que el primer toast se renderice correctamente
    setTimeout(() => {
      this.toastsSubject.next([...currentToasts, toast]);
    }, 10);

    // Auto-remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration || 5000);
    }
  }

  /**
   * Muestra un toast de éxito
   */
  success(title: string, message: string, duration?: number): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration: duration || 5000,
      showCloseButton: true
    };
    this.addToast(toast);
  }

  /**
   * Muestra un toast de error
   */
  error(title: string, message: string, duration?: number): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration: duration || 7000, // Los errores duran más tiempo
      showCloseButton: true
    };
    this.addToast(toast);
  }

  /**
   * Muestra un toast de advertencia
   */
  warning(title: string, message: string, duration?: number): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration: duration || 6000,
      showCloseButton: true
    };
    this.addToast(toast);
  }

  /**
   * Muestra un toast informativo
   */
  info(title: string, message: string, duration?: number): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration: duration || 5000,
      showCloseButton: true
    };
    this.addToast(toast);
  }

  /**
   * Remueve un toast específico
   */
  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  /**
   * Limpia todos los toasts
   */
  clearAll(): void {
    this.toastsSubject.next([]);
  }

  /**
   * Métodos de conveniencia para casos comunes
   */
  
  // Para favoritos
  favoriteAdded(comicTitle: string): void {
    this.success(
      '¡Agregado a favoritos!',
      `${comicTitle} se ha agregado a tus favoritos`,
      5000 // 5 segundos
    );
  }

  favoriteRemoved(comicTitle: string): void {
    this.success(
      'Eliminado de favoritos',
      `${comicTitle} se ha eliminado de tus favoritos`,
      5000 // 5 segundos
    );
  }

  favoriteError(action: 'agregar' | 'eliminar', comicTitle: string): void {
    this.error(
      'Error en favoritos',
      `No se pudo ${action} ${comicTitle} de tus favoritos`,
      6000 // 6 segundos para errores
    );
  }

  // Para búsquedas
  searchError(query: string): void {
    this.error(
      'Error en búsqueda',
      `No se pudo buscar "${query}". Inténtalo de nuevo.`,
      6000
    );
  }

  // Para carga de datos
  loadingError(resource: string): void {
    this.error(
      'Error de carga',
      `No se pudieron cargar los ${resource}. Verifica tu conexión.`,
      6000
    );
  }

  // Para autenticación
  loginSuccess(userName: string): void {
    this.success(
      '¡Bienvenido!',
      `Hola ${userName}, has iniciado sesión correctamente`,
      4000
    );
  }

  loginError(): void {
    this.error(
      'Error de inicio de sesión',
      'Credenciales incorrectas. Verifica tu email y contraseña.',
      6000
    );
  }

  logoutSuccess(): void {
    this.success(
      'Sesión cerrada',
      'Has cerrado sesión correctamente',
      3000
    );
  }
}
