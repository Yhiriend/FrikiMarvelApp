import { Injectable } from '@angular/core';
import { ComicFavorite, CreateComicFavoriteRequest } from '../../domain/entities/comic-favorite.entity';
import { ComicFavoriteRepository as IComicFavoriteRepository } from '../../domain/repositories/comic-favorite.repository';
import { apiConfig } from '../../shared/config/api.config';
import { 
  CreateComicFavoriteResponse, 
  ComicFavoritesListResponse, 
  DeleteComicFavoriteResponse,
  ComicFavoriteApiResponse 
} from '../../shared/interfaces/api-responses.interface';

@Injectable({
  providedIn: 'root'
})
export class ComicFavoriteRepositoryImpl implements IComicFavoriteRepository {

  async addToFavorites(favorite: CreateComicFavoriteRequest): Promise<ComicFavorite> {
    try {
      const response = await apiConfig.post<CreateComicFavoriteResponse>('/comicfavorites', favorite);

      if (!response.success) {
        throw new Error(response.message || 'Failed to add comic to favorites');
      }

      if (!response.data) {
        return {
          id: 0,
          comicId: favorite.comicId,
          imageUrl: favorite.imageUrl,
          format: favorite.format,
          title: favorite.title,
          onSaleDate: favorite.onSaleDate,
          author: favorite.author,
          price: favorite.price,
          characters: favorite.characters,
          addedDate: new Date().toISOString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

      return this.mapApiResponseToEntity(response.data as unknown as ComicFavoriteApiResponse);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add comic to favorites');
    }
  }

  async removeFromFavorites(comicId: number): Promise<boolean> {
    try {
      const response = await apiConfig.delete<DeleteComicFavoriteResponse>(`/comicfavorites/${comicId}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to remove comic from favorites');
      }

      return true;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to remove comic from favorites');
    }
  }

  async getFavorites(): Promise<ComicFavorite[]> {
    try {
      const response = await apiConfig.get<ComicFavoritesListResponse>('/comicfavorites');

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch favorites');
      }

      return (response.data as any).favorites.map(this.mapApiResponseToEntity);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch favorites');
    }
  }

  async isFavorite(comicId: number): Promise<boolean> {
    try {
      const favorite = await this.getFavoriteByComicId(comicId);
      return favorite !== null;
    } catch (error) {
      return false;
    }
  }

  async getFavoriteByComicId(comicId: number): Promise<ComicFavorite | null> {
    try {
      const favorites = await this.getFavorites();
      return favorites.find(fav => fav.comicId === comicId) || null;
    } catch (error) {
      return null;
    }
  }

  private mapApiResponseToEntity(apiFavorite: ComicFavoriteApiResponse): ComicFavorite {
    return {
      id: apiFavorite.id,
      comicId: apiFavorite.comicId,
      imageUrl: apiFavorite.imageUrl,
      format: apiFavorite.format,
      title: apiFavorite.title,
      onSaleDate: apiFavorite.onSaleDate,
      author: apiFavorite.author,
      price: apiFavorite.price,
      characters: apiFavorite.characters,
      addedDate: apiFavorite.addedDate,
      createdAt: new Date(apiFavorite.createdAt),
      updatedAt: new Date(apiFavorite.updatedAt)
    };
  }
}