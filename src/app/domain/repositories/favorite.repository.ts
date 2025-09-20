import { Favorite, FavoriteComic } from '../entities/favorite.entity';

export interface FavoriteRepository {
  addToFavorites(userId: string, comicId: string): Promise<Favorite>;
  removeFromFavorites(userId: string, comicId: string): Promise<void>;
  getUserFavorites(userId: string): Promise<FavoriteComic[]>;
  isFavorite(userId: string, comicId: string): Promise<boolean>;
}
