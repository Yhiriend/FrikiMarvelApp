import { Injectable } from '@angular/core';
import { Comic, ComicSummary, ComicsList } from '../../domain/entities/comic.entity';
import { ComicRepository as IComicRepository } from '../../domain/repositories/comic.repository';
import { apiConfig } from '../../shared/config/api.config';
import { ComicsListResponse, ComicApiResponse, MarvelApiResponse, MarvelApiData } from '../../shared/interfaces/api-responses.interface';
import { CacheService } from '../../shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class ComicRepositoryImpl implements IComicRepository {

  constructor(private cacheService: CacheService) {}

  async getAllComics(offset: number = 0, limit: number = 20): Promise<ComicsList> {
    const cacheKey = this.cacheService.generateComicsKey(offset, limit);
    
    const cachedData = this.cacheService.get<ComicsList>(cacheKey);
    if (cachedData) {
      console.log('📦 Cargando cómics desde caché:', cacheKey);
      return cachedData;
    }

    try {
      console.log('🌐 Cargando cómics desde API:', cacheKey);
      const response = await apiConfig.get<ComicsListResponse>(`/marvel/comics?offset=${offset}&limit=${limit}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch comics');
      }

      const marvelData = (response.data.data as any) as MarvelApiData;
      const comicsList: ComicsList = {
        offset: marvelData.offset,
        limit: marvelData.limit,
        total: marvelData.total,
        count: marvelData.count,
        results: marvelData.results.map(this.mapComicApiToEntity)
      };

      this.cacheService.set(cacheKey, comicsList, 10 * 60 * 1000);
      
      return comicsList;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch comics');
    }
  }

  async getComicById(id: number): Promise<Comic | null> {
    const cacheKey = this.cacheService.generateComicDetailKey(id);
    
    const cachedComic = this.cacheService.get<Comic>(cacheKey);
    if (cachedComic) {
      console.log('📦 Cargando cómic desde caché:', cacheKey);
      return cachedComic;
    }

    try {
      console.log('🌐 Cargando cómic desde API:', cacheKey);
      const response = await apiConfig.get<ComicsListResponse>(`/marvel/comics/${id}`);

      const marvelData = (response.data.data as any) as MarvelApiData;
      if (!response.success || !marvelData.results || marvelData.results.length === 0) {
        return null;
      }

      const comic = this.mapComicApiToEntity(marvelData.results[0]);
      
      this.cacheService.set(cacheKey, comic, 15 * 60 * 1000);
      
      return comic;
    } catch (error) {
      return null;
    }
  }

  async searchComics(query: string, offset: number = 0, limit: number = 20): Promise<ComicsList> {
    const cacheKey = this.cacheService.generateComicsKey(offset, limit, query);
    
    const cachedData = this.cacheService.get<ComicsList>(cacheKey);
    if (cachedData) {
      console.log('📦 Cargando búsqueda desde caché:', cacheKey);
      return cachedData;
    }

    try {
      console.log('🌐 Cargando búsqueda desde API:', cacheKey);
      const response = await apiConfig.get<ComicsListResponse>(`/marvel/comics/search?title=${encodeURIComponent(query)}&limit=${limit}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to search comics');
      }

      const marvelData = (response.data.data as any) as MarvelApiData;
      const comicsList: ComicsList = {
        offset: marvelData.offset || 0,
        limit: marvelData.limit || limit,
        total: marvelData.total || 0,
        count: marvelData.count || 0,
        results: marvelData.results.map(this.mapComicApiToEntity)
      };

      this.cacheService.set(cacheKey, comicsList, 5 * 60 * 1000);
      
      return comicsList;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to search comics');
    }
  }

  async getComicsBySeries(series: string, offset: number = 0, limit: number = 20): Promise<ComicsList> {
    try {
      const response = await apiConfig.get<ComicsListResponse>(`/marvel/comics?series=${encodeURIComponent(series)}&offset=${offset}&limit=${limit}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch comics by series');
      }

      const marvelData = (response.data.data as any) as MarvelApiData;
      return {
        offset: marvelData.offset,
        limit: marvelData.limit,
        total: marvelData.total,
        count: marvelData.count,
        results: marvelData.results.map(this.mapComicApiToEntity)
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch comics by series');
    }
  }

  async getComicsByCreator(creator: string, offset: number = 0, limit: number = 20): Promise<ComicsList> {
    try {
      const response = await apiConfig.get<ComicsListResponse>(`/marvel/comics?creator=${encodeURIComponent(creator)}&offset=${offset}&limit=${limit}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch comics by creator');
      }

      const marvelData = (response.data.data as any) as MarvelApiData;
      return {
        offset: marvelData.offset,
        limit: marvelData.limit,
        total: marvelData.total,
        count: marvelData.count,
        results: marvelData.results.map(this.mapComicApiToEntity)
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch comics by creator');
    }
  }

  private mapComicApiToEntity(apiComic: ComicApiResponse): Comic {
    return {
      id: apiComic.id,
      digitalId: apiComic.digitalId,
      title: apiComic.title,
      issueNumber: apiComic.issueNumber,
      variantDescription: apiComic.variantDescription,
      description: apiComic.description || 'No description available',
      modified: apiComic.modified,
      isbn: apiComic.isbn,
      upc: apiComic.upc,
      diamondCode: apiComic.diamondCode,
      ean: apiComic.ean,
      issn: apiComic.issn,
      format: apiComic.format,
      pageCount: apiComic.pageCount,
      textObjects: apiComic.textObjects,
      resourceUri: apiComic.resourceUri,
      urls: apiComic.urls,
      thumbnail: apiComic.thumbnail,
      images: apiComic.images,
      creators: apiComic.creators,
      characters: apiComic.characters,
      stories: apiComic.stories,
      events: apiComic.events,
      dates: apiComic.dates,
      prices: apiComic.prices
    };
  }
}