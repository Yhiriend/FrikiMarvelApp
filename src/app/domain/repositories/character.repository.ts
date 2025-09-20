import { Character, CharacterSummary, CharactersList } from '../entities/character.entity';

export interface CharacterRepository {
  getAllCharacters(offset?: number, limit?: number): Promise<CharactersList>;
  getCharacterById(id: number): Promise<Character | null>;
  searchCharacters(query: string, offset?: number, limit?: number): Promise<CharactersList>;
  getCharactersByComic(comicId: number, offset?: number, limit?: number): Promise<CharactersList>;
  getCharactersBySeries(seriesId: number, offset?: number, limit?: number): Promise<CharactersList>;
}
