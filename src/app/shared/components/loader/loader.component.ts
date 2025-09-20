import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoaderSize = 'small' | 'medium' | 'large';
export type LoaderColor = 'primary' | 'secondary' | 'white' | 'dark';
export type LoaderLayout = 'default' | 'inline' | 'fullscreen' | 'overlay';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() size: LoaderSize = 'medium';
  @Input() color: LoaderColor = 'primary';
  @Input() layout: LoaderLayout = 'default';
  @Input() message: string = '';
  @Input() showDefaultMessage: boolean = true;

  get defaultMessage(): string {
    switch (this.layout) {
      case 'fullscreen':
        return 'Cargando...';
      case 'overlay':
        return 'Procesando...';
      case 'inline':
        return 'Cargando';
      default:
        return 'Cargando...';
    }
  }

  getLoaderClasses(): string {
    const classes = ['loader'];
    
    // Size class
    classes.push(`loader--${this.size}`);
    
    // Color class
    classes.push(`loader--${this.color}`);
    
    // Layout class
    if (this.layout !== 'default') {
      classes.push(`loader--${this.layout}`);
    }
    
    return classes.join(' ');
  }

  getSpinnerClasses(): string {
    return 'loader-spinner';
  }
}
