export interface Character {
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

export interface CharactersList {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Character[];
}

export interface CharacterSummary {
  id: number;
  name: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  description: string;
}
