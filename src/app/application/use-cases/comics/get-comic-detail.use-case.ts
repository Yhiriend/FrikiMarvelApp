import { Injectable, Inject } from '@angular/core';
import { ComicRepository } from '../../../domain/repositories/comic.repository';
import { Comic } from '../../../domain/entities/comic.entity';
import { COMIC_REPOSITORY_TOKEN } from '../../../shared/tokens/injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class GetComicDetailUseCase {
  constructor(
    @Inject(COMIC_REPOSITORY_TOKEN) private comicRepository: ComicRepository
  ) {}

  async execute(id: number): Promise<Comic | null> {
    return await this.comicRepository.getComicById(id);
  }
}