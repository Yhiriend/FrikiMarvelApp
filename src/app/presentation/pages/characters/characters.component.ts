import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CharacterCardComponent } from '../../../shared/components/character-card/character-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { GetCharactersUseCase } from '../../../application/use-cases/characters/get-characters.use-case';
import { SearchCharactersUseCase } from '../../../application/use-cases/characters/search-characters.use-case';
import { Character, CharactersList } from '../../../domain/entities/character.entity';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CharacterCardComponent, LoaderComponent],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  characters: Character[] = [];
  charactersList: CharactersList | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  currentOffset: number = 0;
  limit: number = 20;
  hasMore: boolean = false;

  constructor(
    private getCharactersUseCase: GetCharactersUseCase,
    private searchCharactersUseCase: SearchCharactersUseCase,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  async loadCharacters(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      this.charactersList = await this.getCharactersUseCase.execute(this.currentOffset, this.limit);
      this.characters = this.charactersList.results;
      this.hasMore = this.currentOffset + this.limit < this.charactersList.total;
    } catch (error: any) {
      this.error = error.message || 'Error al cargar los personajes';
      console.error('Error loading characters:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadMoreCharacters(): Promise<void> {
    if (this.isLoading || !this.hasMore) return;

    this.currentOffset += this.limit;
    this.isLoading = true;

    try {
      const newCharactersList = await this.getCharactersUseCase.execute(this.currentOffset, this.limit);
      this.characters = [...this.characters, ...newCharactersList.results];
      this.hasMore = this.currentOffset + this.limit < newCharactersList.total;
    } catch (error: any) {
      this.error = error.message || 'Error al cargar más personajes';
      console.error('Error loading more characters:', error);
      this.currentOffset -= this.limit; // Revert offset on error
    } finally {
      this.isLoading = false;
    }
  }

  async searchCharacters(query: string): Promise<void> {
    if (!query.trim()) {
      this.currentOffset = 0;
      this.loadCharacters();
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.currentOffset = 0;

    try {
      this.charactersList = await this.searchCharactersUseCase.execute(query, this.currentOffset, this.limit);
      this.characters = this.charactersList.results;
      this.hasMore = this.currentOffset + this.limit < this.charactersList.total;
    } catch (error: any) {
      this.error = error.message || 'Error al buscar personajes';
      console.error('Error searching characters:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onCharacterClick(character: Character): void {
    this.router.navigate(['/character', character.id]);
  }

  onViewClick(character: Character): void {
    this.router.navigate(['/character', character.id]);
  }
}
