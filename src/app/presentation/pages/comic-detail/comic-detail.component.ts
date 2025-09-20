import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { GetComicDetailUseCase } from '../../../application/use-cases/comics/get-comic-detail.use-case';
import { AddToFavoritesUseCase } from '../../../application/use-cases/favorites/add-to-favorites.use-case';
import { RemoveFromFavoritesUseCase } from '../../../application/use-cases/favorites/remove-from-favorites.use-case';
import { CheckFavoriteUseCase } from '../../../application/use-cases/favorites/check-favorite.use-case';
import { Comic } from '../../../domain/entities/comic.entity';
import { CreateComicFavoriteRequest } from '../../../domain/entities/comic-favorite.entity';
import { BreadcrumbItem } from '../../../shared/interfaces/breadcrumb.interface';

@Component({
  selector: 'app-comic-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, LoaderComponent],
  templateUrl: './comic-detail.component.html',
  styleUrls: ['./comic-detail.component.scss']
})
export class ComicDetailComponent implements OnInit {
  comic: Comic | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  comicId: number | null = null;
  breadcrumbItems: BreadcrumbItem[] = [];
  isFavorite: boolean = false;
  isFavoriteLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private getComicDetailUseCase: GetComicDetailUseCase,
    private addToFavoritesUseCase: AddToFavoritesUseCase,
    private removeFromFavoritesUseCase: RemoveFromFavoritesUseCase,
    private checkFavoriteUseCase: CheckFavoriteUseCase
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.comicId = +params['id'];
      if (this.comicId) {
        this.loadComicDetail();
      }
    });
  }

  async loadComicDetail(): Promise<void> {
    if (!this.comicId) return;

    this.isLoading = true;
    this.error = null;

    try {
      this.comic = await this.getComicDetailUseCase.execute(this.comicId);
      if (!this.comic) {
        this.error = 'Cómic no encontrado';
      } else {
        this.updateBreadcrumb();
        this.checkIfFavorite();
      }
    } catch (error: any) {
      this.error = error.message || 'Error al cargar los detalles del cómic';
      console.error('Error loading comic detail:', error);
    } finally {
      this.isLoading = false;
    }
  }

  updateBreadcrumb(): void {
    if (this.comic) {
      this.breadcrumbItems = [
        { link: '/comics', label: 'Cómics' },
        { link: '', label: this.comic.title }
      ];
    }
  }

  async checkIfFavorite(): Promise<void> {
    if (!this.comicId) return;
    
    try {
      this.isFavorite = await this.checkFavoriteUseCase.execute(this.comicId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }

  async onFavoriteClick(): Promise<void> {
    if (!this.comic || !this.comicId || this.isFavoriteLoading) return;

    this.isFavoriteLoading = true;

    // Optimistic update - change state immediately
    const currentState = this.isFavorite;
    const newState = !currentState;
    this.isFavorite = newState;

    try {
      if (currentState) {
        // Currently favorite, so remove it
        await this.removeFromFavoritesUseCase.execute(this.comicId);
        // State already updated optimistically, no need to change it
      } else {
        // Currently not favorite, so add it
        const favoriteRequest: CreateComicFavoriteRequest = {
          comicId: this.comic.id,
          imageUrl: this.getComicImageUrl(),
          format: this.comic.format,
          title: this.comic.title,
          onSaleDate: this.getReleaseDate(),
          author: this.getComicCreators()[0]?.name || 'Unknown',
          price: this.getComicPriceAsNumber(),
          characters: this.getComicCharacters().map(c => c.name).join(', ') || 'No characters'
        };

        await this.addToFavoritesUseCase.execute(favoriteRequest);
        // State already updated optimistically, no need to change it
      }
    } catch (error: any) {
      console.error('Error managing favorite:', error);
      // Revert the optimistic update on error
      this.isFavorite = currentState;
      // TODO: Show error message to user
    } finally {
      this.isFavoriteLoading = false;
    }
  }

  onShareClick(): void {
    // TODO: Implement share functionality
    console.log('Share clicked for comic:', this.comic);
  }

  getComicImageUrl(): string {
    if (this.comic?.thumbnail && this.comic.thumbnail.path && this.comic.thumbnail.extension) {
      return `${this.comic.thumbnail.path}.${this.comic.thumbnail.extension}`;
    }
    return 'https://via.placeholder.com/400x600/cccccc/666666?text=No+Image';
  }

  getComicPrice(): string {
    if (this.comic?.prices && this.comic.prices.length > 0) {
      const printPrice = this.comic.prices.find(p => p.type === 'printPrice');
      if (printPrice && printPrice.price > 0) {
        return `$${printPrice.price}`;
      }
    }
    return 'N/A';
  }

  getComicPriceAsNumber(): number {
    if (this.comic?.prices && this.comic.prices.length > 0) {
      const printPrice = this.comic.prices.find(p => p.type === 'printPrice');
      if (printPrice && printPrice.price > 0) {
        return printPrice.price;
      }
    }
    return 0;
  }

  getComicCreators(): Array<{name: string, role: string}> {
    if (this.comic?.creators && this.comic.creators.items && this.comic.creators.items.length > 0) {
      return this.comic.creators.items;
    }
    return [];
  }

  getComicCharacters(): Array<{name: string, role: string}> {
    if (this.comic?.characters && this.comic.characters.items && this.comic.characters.items.length > 0) {
      return this.comic.characters.items;
    }
    return [];
  }

  getComicStories(): Array<{name: string, type: string}> {
    if (this.comic?.stories && this.comic.stories.items && this.comic.stories.items.length > 0) {
      return this.comic.stories.items;
    }
    return [];
  }

  getComicEvents(): Array<{name: string}> {
    if (this.comic?.events && this.comic.events.items && this.comic.events.items.length > 0) {
      return this.comic.events.items;
    }
    return [];
  }

  getReleaseDate(): string {
    if (this.comic?.dates && this.comic.dates.length > 0) {
      const onSaleDate = this.comic.dates.find(d => d.type === 'onsaleDate');
      if (onSaleDate && onSaleDate.date) {
        const date = new Date(onSaleDate.date);
        return date.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        });
      }
    }
    return 'N/A';
  }

  getComicSeries(): string {
    if (this.comic?.title) {
      const parts = this.comic.title.split(' Vol. ');
      return parts[0] || this.comic.title;
    }
    return 'Unknown Series';
  }

  getComicIssueNumber(): string {
    if (this.comic?.issueNumber && this.comic.issueNumber > 0) {
      return `#${this.comic.issueNumber}`;
    }
    return '';
  }

  getComicDescription(): string {
    if (this.comic?.description && this.comic.description.trim()) {
      return this.comic.description;
    }
    return 'No hay descripción disponible para este cómic.';
  }

  getComicUrls(): Array<{type: string, url: string}> {
    if (this.comic?.urls && this.comic.urls.length > 0) {
      return this.comic.urls;
    }
    return [];
  }
}
