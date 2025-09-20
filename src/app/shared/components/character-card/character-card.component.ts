import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../../domain/entities/character.entity';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Input() showActions: boolean = true;
  
  @Output() cardClick = new EventEmitter<Character>();
  @Output() viewClick = new EventEmitter<Character>();

  onCardClick(): void {
    this.cardClick.emit(this.character);
  }

  onViewClick(event: Event): void {
    event.stopPropagation();
    this.viewClick.emit(this.character);
  }

  getCharacterImageUrl(): string {
    if (this.character.thumbnail && this.character.thumbnail.path && this.character.thumbnail.extension) {
      return `${this.character.thumbnail.path}.${this.character.thumbnail.extension}`;
    }
    return 'https://via.placeholder.com/200x300/cccccc/666666?text=No+Image';
  }

  getCharacterDescription(): string {
    if (this.character.description && this.character.description.trim().length > 0) {
      return this.character.description;
    }
    return '';
  }

  getComicsCount(): number {
    return this.character.comics?.available || 0;
  }

  getSeriesCount(): number {
    return this.character.series?.available || 0;
  }

  getStoriesCount(): number {
    return this.character.stories?.available || 0;
  }
}
