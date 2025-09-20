import { Injectable, Inject } from '@angular/core';
import { Character } from '../../../domain/entities/character.entity';
import { CharacterRepository } from '../../../domain/repositories/character.repository';
import { CHARACTER_REPOSITORY_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class GetCharacterDetailUseCase {
  constructor(
    @Inject(CHARACTER_REPOSITORY_TOKEN) private characterRepository: CharacterRepository
  ) {}

  async execute(id: number): Promise<Character | null> {
    if (!id || id <= 0) {
      throw new Error('Character ID must be a positive number');
    }

    return await this.characterRepository.getCharacterById(id);
  }
}
