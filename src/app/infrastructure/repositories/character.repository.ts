import { Injectable } from '@angular/core';
import { Character, CharacterSummary, CharactersList } from '../../domain/entities/character.entity';
import { CharacterRepository as ICharacterRepository } from '../../domain/repositories/character.repository';
import { apiConfig } from '../../shared/config/api.config';
import { CharactersListResponse, CharacterApiResponse, CharactersApiResponse, CharactersApiData } from '../../shared/interfaces/api-responses.interface';
import { CacheService } from '../../shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterRepositoryImpl implements ICharacterRepository {

  constructor(private cacheService: CacheService) {}

  async getAllCharacters(offset: number = 0, limit: number = 20): Promise<CharactersList> {
    const cacheKey = this.cacheService.generateCharactersKey(offset, limit);
    const cachedData = this.cacheService.get<CharactersList>(cacheKey);
    
    if (cachedData) {
      console.log('📦 Cargando personajes desde caché:', cacheKey);
      return cachedData;
    }

    try {
      console.log('🌐 Cargando personajes desde API:', cacheKey);
      const response = await apiConfig.get<CharactersListResponse>(`/marvel/characters?offset=${offset}&limit=${limit}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch characters');
      }

      const marvelData = (response.data.data as any) as CharactersApiData;
      const charactersList: CharactersList = {
        offset: marvelData.offset,
        limit: marvelData.limit,
        total: marvelData.total,
        count: marvelData.count,
        results: marvelData.results.map(this.mapCharacterApiToEntity)
      };

      this.cacheService.set(cacheKey, charactersList, 5 * 60 * 1000);
      return charactersList;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch characters');
    }
  }

  async getCharacterById(id: number): Promise<Character | null> {
    const cacheKey = this.cacheService.generateCharacterDetailKey(id);
    const cachedData = this.cacheService.get<Character>(cacheKey);
    
    if (cachedData) {
      console.log('📦 Cargando detalle de personaje desde caché:', cacheKey);
      return cachedData;
    }

    try {
      console.log('🌐 Cargando detalle de personaje desde API:', cacheKey);
      const response = await apiConfig.get<CharactersListResponse>(`/marvel/characters/${id}`);

      const marvelData = (response.data.data as any) as CharactersApiData;
      if (!response.success || !marvelData.results || marvelData.results.length === 0) {
        return null;
      }

      const character = this.mapCharacterApiToEntity(marvelData.results[0]);
      
      // Guardar en caché por 10 minutos (los detalles duran más)
      this.cacheService.set(cacheKey, character, 10 * 60 * 1000);
      return character;
    } catch (error) {
      return null;
    }
  }

  async searchCharacters(query: string, offset: number = 0, limit: number = 20): Promise<CharactersList> {
    const cacheKey = this.cacheService.generateCharactersKey(offset, limit, query);
    const cachedData = this.cacheService.get<CharactersList>(cacheKey);
    
    if (cachedData) {
      console.log('📦 Cargando búsqueda de personajes desde caché:', cacheKey);
      return cachedData;
    }

    try {
      console.log('🌐 Cargando búsqueda de personajes desde API:', cacheKey);
      const response = await apiConfig.get<CharactersListResponse>(`/marvel/characters?nameStartsWith=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to search characters');
      }

      const marvelData = (response.data.data as any) as CharactersApiData;
      const charactersList: CharactersList = {
        offset: marvelData.offset,
        limit: marvelData.limit,
        total: marvelData.total,
        count: marvelData.count,
        results: marvelData.results.map(this.mapCharacterApiToEntity)
      };

      // Guardar en caché por 5 minutos
      this.cacheService.set(cacheKey, charactersList, 5 * 60 * 1000);
      return charactersList;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to search characters');
    }
  }

  async getCharactersByComic(comicId: number, offset: number = 0, limit: number = 20): Promise<CharactersList> {
    const cacheKey = `characters_by_comic_${comicId}_${offset}_${limit}`;
    const cachedData = this.cacheService.get<CharactersList>(cacheKey);
    
    if (cachedData) {
      console.log('📦 Cargando personajes por cómic desde caché:', cacheKey);
      return cachedData;
    }

    try {
      console.log('🌐 Cargando personajes por cómic desde API:', cacheKey);
      const response = await apiConfig.get<CharactersListResponse>(`/marvel/comics/${comicId}/characters?offset=${offset}&limit=${limit}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch characters by comic');
      }

      const marvelData = (response.data.data as any) as CharactersApiData;
      const charactersList: CharactersList = {
        offset: marvelData.offset,
        limit: marvelData.limit,
        total: marvelData.total,
        count: marvelData.count,
        results: marvelData.results.map(this.mapCharacterApiToEntity)
      };

      // Guardar en caché por 5 minutos
      this.cacheService.set(cacheKey, charactersList, 5 * 60 * 1000);
      return charactersList;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch characters by comic');
    }
  }

  async getCharactersBySeries(seriesId: number, offset: number = 0, limit: number = 20): Promise<CharactersList> {
    const cacheKey = `characters_by_series_${seriesId}_${offset}_${limit}`;
    const cachedData = this.cacheService.get<CharactersList>(cacheKey);
    
    if (cachedData) {
      console.log('📦 Cargando personajes por serie desde caché:', cacheKey);
      return cachedData;
    }

    try {
      console.log('🌐 Cargando personajes por serie desde API:', cacheKey);
      const response = await apiConfig.get<CharactersListResponse>(`/marvel/series/${seriesId}/characters?offset=${offset}&limit=${limit}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch characters by series');
      }

      const marvelData = (response.data.data as any) as CharactersApiData;
      const charactersList: CharactersList = {
        offset: marvelData.offset,
        limit: marvelData.limit,
        total: marvelData.total,
        count: marvelData.count,
        results: marvelData.results.map(this.mapCharacterApiToEntity)
      };

      // Guardar en caché por 5 minutos
      this.cacheService.set(cacheKey, charactersList, 5 * 60 * 1000);
      return charactersList;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch characters by series');
    }
  }

  private mapCharacterApiToEntity(apiCharacter: CharacterApiResponse): Character {
    return {
      id: apiCharacter.id,
      name: apiCharacter.name,
      description: apiCharacter.description || 'No description available',
      modified: apiCharacter.modified,
      resourceUri: apiCharacter.resourceUri,
      urls: apiCharacter.urls,
      thumbnail: apiCharacter.thumbnail,
      comics: apiCharacter.comics,
      stories: apiCharacter.stories,
      events: apiCharacter.events,
      series: apiCharacter.series
    };
  }
}
