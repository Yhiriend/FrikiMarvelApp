# Loader Component

Componente reutilizable para mostrar estados de carga en toda la aplicación.

## Características

- **Múltiples tamaños**: `small`, `medium`, `large`
- **Múltiples colores**: `primary`, `secondary`, `white`, `dark`
- **Múltiples layouts**: `default`, `inline`, `fullscreen`, `overlay`
- **Mensajes personalizables**
- **Responsive design**
- **Animaciones suaves**

## Uso Básico

```html
<app-loader></app-loader>
```

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño del spinner |
| `color` | `'primary' \| 'secondary' \| 'white' \| 'dark'` | `'primary'` | Color del spinner |
| `layout` | `'default' \| 'inline' \| 'fullscreen' \| 'overlay'` | `'default'` | Layout del loader |
| `message` | `string` | `''` | Mensaje personalizado |
| `showDefaultMessage` | `boolean` | `true` | Mostrar mensaje por defecto |

## Ejemplos de Uso

### Loader Básico
```html
<app-loader message="Cargando datos..."></app-loader>
```

### Loader Pequeño
```html
<app-loader size="small" message="Procesando..."></app-loader>
```

### Loader Grande con Color Secundario
```html
<app-loader size="large" color="secondary" message="Cargando cómics..."></app-loader>
```

### Loader Inline
```html
<app-loader layout="inline" size="small" message="Guardando..."></app-loader>
```

### Loader Fullscreen
```html
<app-loader layout="fullscreen" message="Cargando aplicación..."></app-loader>
```

### Loader Overlay
```html
<div class="relative-container">
  <app-loader layout="overlay" message="Procesando..."></app-loader>
</div>
```

### Loader Blanco (para fondos oscuros)
```html
<app-loader color="white" message="Cargando..."></app-loader>
```

## Casos de Uso Implementados

### Páginas de Listado
- **Cómics**: Loader grande blanco para carga inicial
- **Personajes**: Loader grande blanco para carga inicial
- **Favoritos**: Loader grande blanco para carga inicial

### Páginas de Detalle
- **Detalle de Cómic**: Loader grande blanco
- **Detalle de Personaje**: Loader grande blanco

### Estados de Carga Adicional
- **Cargar más**: Loader mediano para paginación
- **Búsquedas**: Loader mediano para resultados

## Estilos CSS

El componente incluye estilos responsivos que se adaptan automáticamente a diferentes tamaños de pantalla:

- **Desktop**: Tamaños completos
- **Tablet**: Tamaños reducidos
- **Mobile**: Tamaños optimizados para móviles

## Integración

El componente está disponible en todas las páginas de la aplicación y se puede usar fácilmente importando:

```typescript
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
```

Y agregándolo a los imports del componente:

```typescript
@Component({
  imports: [CommonModule, LoaderComponent, ...]
})
```
