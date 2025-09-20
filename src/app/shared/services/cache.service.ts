import { Injectable } from '@angular/core';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos por defecto

  constructor() {
    // Limpiar caché al recargar la página
    this.clearCache();
  }

  /**
   * Guarda un elemento en el caché
   * @param key Clave única para el elemento
   * @param data Datos a guardar
   * @param ttl Tiempo de vida en milisegundos (opcional, por defecto 5 minutos)
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };
    
    this.cache.set(key, cacheItem);
  }

  /**
   * Obtiene un elemento del caché
   * @param key Clave del elemento
   * @returns Los datos si existen y no han expirado, null en caso contrario
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar si el elemento ha expirado
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Verifica si un elemento existe en el caché y no ha expirado
   * @param key Clave del elemento
   * @returns true si existe y no ha expirado, false en caso contrario
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Verificar si el elemento ha expirado
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Elimina un elemento específico del caché
   * @param key Clave del elemento a eliminar
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpia todo el caché
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Limpia elementos expirados del caché
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Obtiene información sobre el estado del caché
   */
  getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Genera una clave de caché para cómics con paginación
   */
  generateComicsKey(offset: number, limit: number, searchQuery?: string): string {
    if (searchQuery) {
      return `comics_search_${searchQuery}_${offset}_${limit}`;
    }
    return `comics_list_${offset}_${limit}`;
  }

  /**
   * Genera una clave de caché para un cómic específico
   */
  generateComicDetailKey(comicId: number): string {
    return `comic_detail_${comicId}`;
  }

  /**
   * Genera una clave de caché para personajes con paginación
   */
  generateCharactersKey(offset: number, limit: number, searchQuery?: string): string {
    if (searchQuery) {
      return `characters_search_${searchQuery}_${offset}_${limit}`;
    }
    return `characters_list_${offset}_${limit}`;
  }

  /**
   * Genera una clave de caché para un personaje específico
   */
  generateCharacterDetailKey(characterId: number): string {
    return `character_detail_${characterId}`;
  }
}
