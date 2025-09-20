import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CacheService } from './shared/services/cache.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'FrikiMarvelApp';

  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    // Limpiar caché al inicializar la aplicación (recarga de página)
    this.cacheService.clearCache();
    console.log('🧹 Caché limpiado al inicializar la aplicación');
  }
}
