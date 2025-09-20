export interface ComicFavorite {
  id?: number;
  comicId: number;
  imageUrl: string;
  format: string;
  title: string;
  onSaleDate: string;
  author: string;
  price: number;
  characters: string;
  addedDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateComicFavoriteRequest {
  comicId: number;
  imageUrl: string;
  format: string;
  title: string;
  onSaleDate: string;
  author: string;
  price: number;
  characters: string;
}
