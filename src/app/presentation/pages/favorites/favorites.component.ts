import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { GetFavoritesUseCase } from '../../../application/use-cases/favorites/get-favorites.use-case';
import { RemoveFromFavoritesUseCase } from '../../../application/use-cases/favorites/remove-from-favorites.use-case';
import { ComicFavorite } from '../../../domain/entities/comic-favorite.entity';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, LoaderComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: ComicFavorite[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private getFavoritesUseCase: GetFavoritesUseCase,
    private removeFromFavoritesUseCase: RemoveFromFavoritesUseCase,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  async loadFavorites(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      this.favorites = await this.getFavoritesUseCase.execute();
    } catch (error: any) {
      this.error = error.message || 'Error al cargar los favoritos';
      console.error('Error loading favorites:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onRemoveFavorite(favorite: ComicFavorite): Promise<void> {
    // Optimistic update - remove from local array immediately
    const originalFavorites = [...this.favorites];
    this.favorites = this.favorites.filter(fav => fav.comicId !== favorite.comicId);

    try {
      await this.removeFromFavoritesUseCase.execute(favorite.comicId);
      // State already updated optimistically, no need to change it
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      // Revert the optimistic update on error
      this.favorites = originalFavorites;
      // TODO: Show error message to user
    }
  }

  onComicClick(favorite: ComicFavorite): void {
    this.router.navigate(['/comic', favorite.comicId]);
  }

  onViewClick(favorite: ComicFavorite): void {
    this.router.navigate(['/comic', favorite.comicId]);
  }

  // Helper methods to convert ComicFavorite to Comic-like object for ComicCardComponent
  getComicImageUrl(favorite: ComicFavorite): string {
    return favorite.imageUrl || 'https://via.placeholder.com/200x300/cccccc/666666?text=No+Image';
  }

  getComicSeriesTitle(favorite: ComicFavorite): string {
    return favorite.title.split('(')[0].trim();
  }

  getComicIssueNumber(favorite: ComicFavorite): string {
    // Extract issue number from title if available
    const match = favorite.title.match(/#(\d+)/);
    return match ? `#${match[1]}` : '';
  }

  getComicFormat(favorite: ComicFavorite): string {
    return favorite.format || 'N/A';
  }

  getComicOnsaleDate(favorite: ComicFavorite): string {
    return favorite.onSaleDate || 'N/A';
  }

  getComicCreators(favorite: ComicFavorite): string {
    return favorite.author || 'Unknown';
  }

  getComicCharacters(favorite: ComicFavorite): string {
    return favorite.characters || 'No characters';
  }

  getComicPrice(favorite: ComicFavorite): string {
    return favorite.price > 0 ? `$${favorite.price.toFixed(2)}` : 'N/A';
  }
}
