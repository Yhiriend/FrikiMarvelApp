import { Injectable, Inject } from '@angular/core';
import { Comic, ComicsList } from '../../../domain/entities/comic.entity';
import { ComicRepository } from '../../../domain/repositories/comic.repository';
import { COMIC_REPOSITORY_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class GetComicsUseCase {
  constructor(
    @Inject(COMIC_REPOSITORY_TOKEN) private comicRepository: ComicRepository
  ) {}

  async execute(offset: number = 0, limit: number = 20): Promise<ComicsList> {
    if (offset < 0) {
      throw new Error('Offset must be a positive number');
    }
    if (limit <= 0 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    return await this.comicRepository.getAllComics(offset, limit);
  }
}
