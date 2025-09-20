import { Comic, ComicSummary, ComicsList } from '../entities/comic.entity';

export interface ComicRepository {
  getAllComics(offset?: number, limit?: number): Promise<ComicsList>;
  getComicById(id: number): Promise<Comic | null>;
  searchComics(query: string, offset?: number, limit?: number): Promise<ComicsList>;
  getComicsBySeries(series: string, offset?: number, limit?: number): Promise<ComicsList>;
  getComicsByCreator(creator: string, offset?: number, limit?: number): Promise<ComicsList>;
}
