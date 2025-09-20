import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../domain/services/auth.service';
import { User } from '../../../domain/entities/user.entity';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AUTH_SERVICE_TOKEN } from '../../../shared/tokens/injection.tokens';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  
  currentUser: User | null = null;
  searchQuery: string = '';

  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private async loadCurrentUser(): Promise<void> {
    this.currentUser = await this.authService.getCurrentUser();
  }

  async logout(): Promise<void> {
    await this.authService.logoutUser();
    this.router.navigate(['/login']);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Navegar a la página de cómics con el parámetro de búsqueda
      this.router.navigate(['/comics'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }

  get userInitials(): string {
    if (!this.currentUser) return 'U';
    return this.currentUser.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
