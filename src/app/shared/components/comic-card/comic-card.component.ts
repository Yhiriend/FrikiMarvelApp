import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comic } from '../../../domain/entities/comic.entity';

@Component({
  selector: 'app-comic-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comic-card.component.html',
  styleUrls: ['./comic-card.component.scss']
})
export class ComicCardComponent {
  @Input() comic!: Comic;
  @Input() showActions: boolean = true;
  @Input() isFavorite: boolean = false;
  @Input() isFavoriteLoading: boolean = false;
  
  @Output() cardClick = new EventEmitter<Comic>();
  @Output() favoriteClick = new EventEmitter<Comic>();
  @Output() viewClick = new EventEmitter<Comic>();

  onCardClick(): void {
    this.cardClick.emit(this.comic);
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteClick.emit(this.comic);
  }

  onViewClick(event: Event): void {
    event.stopPropagation();
    this.viewClick.emit(this.comic);
  }

  getComicImageUrl(): string {
    if (this.comic.thumbnail && this.comic.thumbnail.path && this.comic.thumbnail.extension) {
      return `${this.comic.thumbnail.path}.${this.comic.thumbnail.extension}`;
    }
    return 'https://via.placeholder.com/200x300/cccccc/666666?text=No+Image';
  }

  getComicPrice(): string {
    if (this.comic.prices && this.comic.prices.length > 0) {
      const printPrice = this.comic.prices.find(p => p.type === 'printPrice');
      if (printPrice && printPrice.price > 0) {
        return `$${printPrice.price}`;
      }
    }
    return 'N/A';
  }

  getComicCreators(): string {
    if (this.comic.creators && this.comic.creators.items && this.comic.creators.items.length > 0) {
      return this.comic.creators.items.slice(0, 2).map(creator => creator.name).join(', ');
    }
    return 'Unknown';
  }

  getComicCharacters(): string {
    if (this.comic.characters && this.comic.characters.items && this.comic.characters.items.length > 0) {
      return this.comic.characters.items.slice(0, 2).map(character => character.name).join(', ');
    }
    return 'No characters';
  }

  getComicIssueNumber(): string {
    if (this.comic.issueNumber && this.comic.issueNumber > 0) {
      return `#${this.comic.issueNumber}`;
    }
    return '';
  }

  getComicSeries(): string {
    // Marvel API doesn't always provide series info directly, so we'll extract from title
    if (this.comic.title) {
      const parts = this.comic.title.split(' Vol. ');
      return parts[0] || this.comic.title;
    }
    return 'Unknown Series';
  }

  getReleaseDate(): string {
    if (this.comic.dates && this.comic.dates.length > 0) {
      const onSaleDate = this.comic.dates.find(d => d.type === 'onsaleDate');
      if (onSaleDate && onSaleDate.date) {
        const date = new Date(onSaleDate.date);
        return date.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
      }
    }
    return 'N/A';
  }
}
