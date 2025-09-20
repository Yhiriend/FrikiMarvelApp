import { Injectable, Inject } from '@angular/core';
import { Character, CharactersList } from '../../../domain/entities/character.entity';
import { CharacterRepository } from '../../../domain/repositories/character.repository';
import { CHARACTER_REPOSITORY_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class GetCharactersUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY_TOKEN) private characterRepository: CharacterRepository
  ) {}

  async execute(offset: number = 0, limit: number = 20): Promise<CharactersList> {
    if (offset < 0) {
      throw new Error('Offset must be a positive number');
    }
    if (limit <= 0 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    return await this.characterRepository.getAllCharacters(offset, limit);
  }
}
