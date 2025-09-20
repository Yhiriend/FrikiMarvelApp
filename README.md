# FrikiMarvelApp

Esta aplicación fue generada usando [Angular CLI](https://github.com/angular/angular-cli) versión 19.2.13.

## 🚀 Comandos Útiles

### Inicio Rápido

Debes tener instalado Node.js y Angular Cli (este último opcional, ya que se encuentra como dependencia de desarrollo)

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm start

# 3. Abrir en el navegador
# http://localhost:4200/
```

Una vez que el servidor esté ejecutándose, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos fuente.

## Generación de código (Solo si tienes ANGULAR CLI instalado)

Angular CLI incluye herramientas poderosas de generación de código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component nombre-del-componente
```

Para una lista completa de esquemas disponibles (como `components`, `directives`, o `pipes`), ejecuta:

```bash
ng generate --help
```

## Construcción

Para construir el proyecto ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de construcción en el directorio `dist/`. Por defecto, la construcción de producción optimiza tu aplicación para rendimiento y velocidad.

## Recursos Adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

## Características de la Aplicación

### 🦸‍♂️ Funcionalidades Principales

- **Exploración de Cómics**: Navega y busca cómics de Marvel
- **Personajes**: Descubre información detallada de tus superhéroes favoritos
- **Favoritos**: Guarda tus cómics preferidos para acceso rápido
- **Búsqueda**: Encuentra cómics y personajes específicos
- **Autenticación**: Sistema de login y registro seguro

### 🚀 Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos y diseño
- **RxJS**: Programación reactiva
- **Clean Architecture**: Arquitectura limpia y escalable

### 📱 Características Técnicas

- **Caché Inteligente**: Sistema de caché para optimizar rendimiento
- **Responsive Design**: Adaptable a todos los dispositivos
- **Toast Notifications**: Notificaciones elegantes para feedback del usuario
- **Guards de Autenticación**: Protección de rutas
- **Lazy Loading**: Carga perezosa de componentes


### 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── @core/                 # Configuración central
│   ├── application/           # Casos de uso
│   ├── domain/               # Entidades y repositorios
│   ├── infrastructure/       # Implementaciones
│   ├── presentation/         # Componentes y páginas
│   └── shared/              # Componentes compartidos
├── environments/            # Configuraciones de entorno
└── styles.scss             # Estilos globales
```

### 🔧 Configuración

La aplicación utiliza variables de entorno para la configuración de la API. Asegúrate de configurar correctamente los archivos en `src/environments/`.

### 📝 Notas de Desarrollo

- La aplicación implementa Clean Architecture para mantener el código organizado y escalable
- Se utiliza inyección de dependencias para facilitar el testing y mantenimiento
- El sistema de caché mejora significativamente la experiencia del usuario
- Las notificaciones toast proporcionan feedback inmediato al usuario
