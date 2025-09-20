import { User } from './user.entity';
import { Comic } from './comic.entity';

export interface Favorite {
  id: string;
  userId: string;
  comicId: string;
  user?: User;
  comic?: Comic;
  createdAt: Date;
}

export interface FavoriteComic {
  id: string;
  comic: Comic;
  addedAt: Date;
}
