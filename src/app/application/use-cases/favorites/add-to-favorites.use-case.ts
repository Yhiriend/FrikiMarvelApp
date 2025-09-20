import { Injectable, Inject } from '@angular/core';
import { ComicFavoriteRepository } from '../../../domain/repositories/comic-favorite.repository';
import { ComicFavorite, CreateComicFavoriteRequest } from '../../../domain/entities/comic-favorite.entity';
import { COMIC_FAVORITE_REPOSITORY_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class AddToFavoritesUseCase {
  constructor(
    @Inject(COMIC_FAVORITE_REPOSITORY_TOKEN) private comicFavoriteRepository: ComicFavoriteRepository
  ) {}

  async execute(favorite: CreateComicFavoriteRequest): Promise<ComicFavorite> {
    return await this.comicFavoriteRepository.addToFavorites(favorite);
  }
}
