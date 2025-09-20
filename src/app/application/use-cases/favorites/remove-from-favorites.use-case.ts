import { Injectable, Inject } from '@angular/core';
import { ComicFavoriteRepository } from '../../../domain/repositories/comic-favorite.repository';
import { COMIC_FAVORITE_REPOSITORY_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class RemoveFromFavoritesUseCase {
  constructor(
    @Inject(COMIC_FAVORITE_REPOSITORY_TOKEN) private comicFavoriteRepository: ComicFavoriteRepository
  ) {}

  async execute(comicId: number): Promise<boolean> {
    return await this.comicFavoriteRepository.removeFromFavorites(comicId);
  }
}
