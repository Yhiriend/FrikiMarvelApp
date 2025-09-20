export interface UserApiResponse {
  id: number;
  name: string;
  identification: string;
  email: string;
  lastLogin: string;
}

export interface CreateUserResponse {
  id: number;
  name: string;
  identification: string;
  email: string;
  lastLogin: string;
}

export interface UpdateUserResponse {
  id: number;
  name: string;
  identification: string;
  email: string;
  lastLogin: string;
}

export interface ValidateCredentialsResponse {
  id: number;
  name: string;
  identification: string;
  email: string;
  lastLogin: string;
}

// Comic API responses
export interface ComicApiResponse {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: Array<{
    type: string;
    language: string;
    text: string;
  }>;
  resourceUri: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  images: Array<{
    path: string;
    extension: string;
  }>;
  creators: {
    available: number;
    returned: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
  characters: {
    available: number;
    returned: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
  stories: {
    available: number;
    returned: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
    returned: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  dates: Array<{
    type: string;
    date: string;
  }>;
  prices: Array<{
    type: string;
    price: number;
  }>;
}

export interface MarvelApiData {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: ComicApiResponse[];
}

export interface MarvelApiResponse {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHtml: string;
  etag: string;
  data: MarvelApiData;
}

export interface ComicsListResponse {
  success: boolean;
  message: string;
  data: MarvelApiResponse;
  error: any;
  timestamp: string;
}

// Comic Favorite API responses
export interface ComicFavoriteApiResponse {
  id: number;
  comicId: number;
  imageUrl: string;
  format: string;
  title: string;
  onSaleDate: string;
  author: string;
  price: number;
  characters: string;
  addedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComicFavoriteResponse {
  success: boolean;
  message: string;
  data: ComicFavoriteApiResponse | null;
  error: any;
  timestamp: string;
}

export interface ComicFavoritesListResponse {
  success: boolean;
  message: string;
  data: {
    favorites: ComicFavoriteApiResponse[];
    totalCount: number;
  };
  error: any;
  timestamp: string;
}

export interface DeleteComicFavoriteResponse {
  success: boolean;
  message: string;
  data: any;
  error: any;
  timestamp: string;
}

// Character API responses
export interface CharacterApiResponse {
  id: number;
  name: string;
  description: string;
  modified: string;
  resourceUri: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    returned: number;
    collectionUri: string;
    items: Array<{
      resourceUri: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    returned: number;
    collectionUri: string;
    items: Array<{
      resourceUri: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
    returned: number;
    collectionUri: string;
    items: Array<{
      resourceUri: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    returned: number;
    collectionUri: string;
    items: Array<{
      resourceUri: string;
      name: string;
    }>;
  };
}

export interface CharactersApiData {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: CharacterApiResponse[];
}

export interface CharactersApiResponse {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHtml: string;
  etag: string;
  data: CharactersApiData;
}

export interface CharactersListResponse {
  success: boolean;
  message: string;
  data: CharactersApiResponse;
  error: any;
  timestamp: string;
}