import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { ComicRepositoryImpl } from './infrastructure/repositories/comic.repository';
import { CharacterRepositoryImpl } from './infrastructure/repositories/character.repository';
import { ComicFavoriteRepositoryImpl } from './infrastructure/repositories/comic-favorite.repository';
import { AuthServiceImpl } from './infrastructure/services/auth.service';
import { COMIC_REPOSITORY_TOKEN, CHARACTER_REPOSITORY_TOKEN, COMIC_FAVORITE_REPOSITORY_TOKEN, AUTH_SERVICE_TOKEN } from './shared/tokens/injection.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: COMIC_REPOSITORY_TOKEN, useClass: ComicRepositoryImpl },
    { provide: CHARACTER_REPOSITORY_TOKEN, useClass: CharacterRepositoryImpl },
    { provide: COMIC_FAVORITE_REPOSITORY_TOKEN, useClass: ComicFavoriteRepositoryImpl },
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthServiceImpl }
  ]
};
