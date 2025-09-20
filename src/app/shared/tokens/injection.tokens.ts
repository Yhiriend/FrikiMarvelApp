import { InjectionToken } from '@angular/core';
import { ComicRepository } from '../../domain/repositories/comic.repository';
import { CharacterRepository } from '../../domain/repositories/character.repository';
import { FavoriteRepository } from '../../domain/repositories/favorite.repository';
import { ComicFavoriteRepository } from '../../domain/repositories/comic-favorite.repository';
import { AuthService } from '../../domain/services/auth.service';

export const COMIC_REPOSITORY_TOKEN = new InjectionToken<ComicRepository>('ComicRepository');
export const CHARACTER_REPOSITORY_TOKEN = new InjectionToken<CharacterRepository>('CharacterRepository');
export const FAVORITE_REPOSITORY_TOKEN = new InjectionToken<FavoriteRepository>('FavoriteRepository');
export const COMIC_FAVORITE_REPOSITORY_TOKEN = new InjectionToken<ComicFavoriteRepository>('ComicFavoriteRepository');
export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>('AuthService');
