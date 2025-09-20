export interface Comic {
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

export interface ComicsList {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Comic[];
}

export interface ComicSummary {
  id: number;
  title: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  format: string;
  series: {
    resourceURI: string;
    name: string;
  };
}
