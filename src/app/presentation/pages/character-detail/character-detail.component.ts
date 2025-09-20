import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { GetCharacterDetailUseCase } from '../../../application/use-cases/characters/get-character-detail.use-case';
import { Character } from '../../../domain/entities/character.entity';
import { BreadcrumbItem } from '../../../shared/interfaces/breadcrumb.interface';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, LoaderComponent],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit {
  character: Character | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  characterId: number | null = null;
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private getCharacterDetailUseCase: GetCharacterDetailUseCase
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.characterId = +params['id'];
      if (this.characterId) {
        this.loadCharacterDetail();
      }
    });
  }

  async loadCharacterDetail(): Promise<void> {
    if (!this.characterId) return;

    this.isLoading = true;
    this.error = null;

    try {
      this.character = await this.getCharacterDetailUseCase.execute(this.characterId);
      
      if (!this.character) {
        this.error = 'Personaje no encontrado';
        return;
      }

      this.setupBreadcrumb();
    } catch (error: any) {
      this.error = error.message || 'Error al cargar el personaje';
      console.error('Error loading character detail:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private setupBreadcrumb(): void {
    if (!this.character) return;

    this.breadcrumbItems = [
      { label: 'Inicio', link: '/comics' },
      { label: 'Personajes', link: '/characters' },
      { label: this.character.name, link: `/character/${this.character.id}` }
    ];
  }

  getCharacterImageUrl(): string {
    if (this.character?.thumbnail && this.character.thumbnail.path && this.character.thumbnail.extension) {
      return `${this.character.thumbnail.path}.${this.character.thumbnail.extension}`;
    }
    return 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Image';
  }
}
