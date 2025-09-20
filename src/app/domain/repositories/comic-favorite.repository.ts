import { ComicFavorite, CreateComicFavoriteRequest } from '../entities/comic-favorite.entity';

export interface ComicFavoriteRepository {
  addToFavorites(favorite: CreateComicFavoriteRequest): Promise<ComicFavorite>;
  removeFromFavorites(comicId: number): Promise<boolean>;
  getFavorites(): Promise<ComicFavorite[]>;
  isFavorite(comicId: number): Promise<boolean>;
  getFavoriteByComicId(comicId: number): Promise<ComicFavorite | null>;
}
