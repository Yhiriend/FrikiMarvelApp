import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ComicCardComponent } from '../../../shared/components/comic-card/comic-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { GetComicsUseCase } from '../../../application/use-cases/comics/get-comics.use-case';
import { SearchComicsUseCase } from '../../../application/use-cases/comics/search-comics.use-case';
import { AddToFavoritesUseCase } from '../../../application/use-cases/favorites/add-to-favorites.use-case';
import { RemoveFromFavoritesUseCase } from '../../../application/use-cases/favorites/remove-from-favorites.use-case';
import { CheckFavoriteUseCase } from '../../../application/use-cases/favorites/check-favorite.use-case';
import { Comic, ComicsList } from '../../../domain/entities/comic.entity';
import { CreateComicFavoriteRequest } from '../../../domain/entities/comic-favorite.entity';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-comics',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, ComicCardComponent, LoaderComponent],
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss']
})
export class ComicsComponent implements OnInit {
  comics: Comic[] = [];
  comicsList: ComicsList | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  currentOffset: number = 0;
  limit: number = 20;
  hasMore: boolean = false;
  favoriteStates: Map<number, boolean> = new Map();
  favoriteLoadingStates: Map<number, boolean> = new Map();

  constructor(
    private getComicsUseCase: GetComicsUseCase,
    private searchComicsUseCase: SearchComicsUseCase,
    private addToFavoritesUseCase: AddToFavoritesUseCase,
    private removeFromFavoritesUseCase: RemoveFromFavoritesUseCase,
    private checkFavoriteUseCase: CheckFavoriteUseCase,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Verificar si hay parámetros de búsqueda en la URL
    this.route.queryParams.subscribe(params => {
      const searchQuery = params['search'];
      if (searchQuery) {
        this.searchComics(searchQuery);
      } else {
        this.loadComics();
      }
    });
  }

  async loadComics(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      this.comicsList = await this.getComicsUseCase.execute(this.currentOffset, this.limit);
      this.comics = this.comicsList.results;
      this.hasMore = this.currentOffset + this.limit < this.comicsList.total;
      await this.checkFavoritesStatus();
    } catch (error: any) {
      this.error = error.message || 'Error al cargar los cómics';
      console.error('Error loading comics:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadMoreComics(): Promise<void> {
    if (this.isLoading || !this.hasMore) return;

    this.currentOffset += this.limit;
    this.isLoading = true;

    try {
      const newComicsList = await this.getComicsUseCase.execute(this.currentOffset, this.limit);
      this.comics = [...this.comics, ...newComicsList.results];
      this.hasMore = this.currentOffset + this.limit < newComicsList.total;
      await this.checkFavoritesStatus();
    } catch (error: any) {
      this.error = error.message || 'Error al cargar más cómics';
      console.error('Error loading more comics:', error);
      this.currentOffset -= this.limit; // Revert offset on error
    } finally {
      this.isLoading = false;
    }
  }

  async searchComics(query: string): Promise<void> {
    if (!query.trim()) {
      this.currentOffset = 0;
      this.loadComics();
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.currentOffset = 0;

    try {
      // Usar límite de 5 para la búsqueda como especifica la API
      this.comicsList = await this.searchComicsUseCase.execute(query, this.currentOffset, 5);
      this.comics = this.comicsList.results;
      this.hasMore = this.currentOffset + 5 < this.comicsList.total;
      await this.checkFavoritesStatus();
    } catch (error: any) {
      this.error = error.message || 'Error al buscar cómics';
      console.error('Error searching comics:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onComicClick(comic: Comic): void {
    this.router.navigate(['/comic', comic.id]);
  }

  async onFavoriteClick(comic: Comic): Promise<void> {
    if (this.favoriteLoadingStates.get(comic.id)) return;

    this.favoriteLoadingStates.set(comic.id, true);

    // Optimistic update - change state immediately
    const currentState = this.favoriteStates.get(comic.id) || false;
    const newState = !currentState;
    this.favoriteStates.set(comic.id, newState);

    try {
      if (currentState) {
        // Currently favorite, so remove it
        console.log('🗑️ Removiendo de favoritos:', comic.title);
        await this.removeFromFavoritesUseCase.execute(comic.id);
        console.log('✅ Removido exitosamente, mostrando toast');
        this.toastService.favoriteRemoved(comic.title);
      } else {
        // Currently not favorite, so add it
        const favoriteRequest: CreateComicFavoriteRequest = {
          comicId: comic.id,
          imageUrl: this.getComicImageUrl(comic),
          format: comic.format,
          title: comic.title,
          onSaleDate: this.getReleaseDate(comic),
          author: this.getComicCreators(comic),
          price: this.getComicPriceAsNumber(comic),
          characters: this.getComicCharacters(comic)
        };

        console.log('❤️ Agregando a favoritos:', comic.title, favoriteRequest);
        const result = await this.addToFavoritesUseCase.execute(favoriteRequest);
        console.log('✅ Agregado exitosamente:', result);
        console.log('📢 Mostrando toast de éxito');
        this.toastService.favoriteAdded(comic.title);
      }
    } catch (error: any) {
      console.error('❌ Error managing favorite:', error);
      // Revert the optimistic update on error
      this.favoriteStates.set(comic.id, currentState);
      // Show error toast
      const action = currentState ? 'eliminar' : 'agregar';
      console.log('📢 Mostrando toast de error');
      this.toastService.favoriteError(action, comic.title);
    } finally {
      this.favoriteLoadingStates.set(comic.id, false);
    }
  }

  onViewClick(comic: Comic): void {
    this.router.navigate(['/comic', comic.id]);
  }

  getComicImageUrl(comic: Comic): string {
    if (comic.thumbnail && comic.thumbnail.path && comic.thumbnail.extension) {
      return `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
    }
    return 'https://via.placeholder.com/200x300/cccccc/666666?text=No+Image';
  }

  getComicPrice(comic: Comic): string {
    if (comic.prices && comic.prices.length > 0) {
      const printPrice = comic.prices.find(p => p.type === 'printPrice');
      if (printPrice && printPrice.price > 0) {
        return `$${printPrice.price}`;
      }
    }
    return 'N/A';
  }

  getComicCreators(comic: Comic): string {
    if (comic.creators && comic.creators.items && comic.creators.items.length > 0) {
      return comic.creators.items.slice(0, 2).map(creator => creator.name).join(', ');
    }
    return 'Unknown';
  }

  getComicCharacters(comic: Comic): string {
    if (comic.characters && comic.characters.items && comic.characters.items.length > 0) {
      return comic.characters.items.slice(0, 2).map(character => character.name).join(', ');
    }
    return 'No characters';
  }

  getComicIssueNumber(comic: Comic): string {
    if (comic.issueNumber && comic.issueNumber > 0) {
      return `#${comic.issueNumber}`;
    }
    return '';
  }

  async checkFavoritesStatus(): Promise<void> {
    const promises = this.comics.map(async (comic) => {
      try {
        const isFavorite = await this.checkFavoriteUseCase.execute(comic.id);
        this.favoriteStates.set(comic.id, isFavorite);
      } catch (error) {
        console.error(`Error checking favorite status for comic ${comic.id}:`, error);
        this.favoriteStates.set(comic.id, false);
      }
    });

    await Promise.all(promises);
  }

  isFavorite(comic: Comic): boolean {
    return this.favoriteStates.get(comic.id) || false;
  }

  isFavoriteLoading(comic: Comic): boolean {
    return this.favoriteLoadingStates.get(comic.id) || false;
  }

  getReleaseDate(comic: Comic): string {
    const onsaleDate = comic.dates?.find(d => d.type === 'onsaleDate');
    if (onsaleDate) {
      return onsaleDate.date;
    }
    return new Date().toISOString();
  }

  getComicPriceAsNumber(comic: Comic): number {
    if (comic.prices && comic.prices.length > 0) {
      const printPrice = comic.prices.find(p => p.type === 'printPrice');
      if (printPrice && printPrice.price > 0) {
        return printPrice.price;
      }
    }
    return 0;
  }
}
