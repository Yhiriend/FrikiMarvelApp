import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/components/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/comics', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'comics', 
    loadComponent: () => import('./presentation/pages/comics/comics.component').then(m => m.ComicsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'comic/:id', 
    loadComponent: () => import('./presentation/pages/comic-detail/comic-detail.component').then(m => m.ComicDetailComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'characters', 
    loadComponent: () => import('./presentation/pages/characters/characters.component').then(m => m.CharactersComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'character/:id', 
    loadComponent: () => import('./presentation/pages/character-detail/character-detail.component').then(m => m.CharacterDetailComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./presentation/pages/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/comics' }
];
