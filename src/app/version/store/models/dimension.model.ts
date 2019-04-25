export interface DimensionApiResponse {
    data?: (Dimension)[] | null;
  }
  export class Dimension {
    id: string;
    name: string;
    category = 'dimension';
    description = '';
    tags = '';
    owner = '';
    location?: (LocationEntity)[] | null = [];
    customProperties?: (CustomPropertiesEntity)[] | null = [];
    elements?: (ElementsEntity)[] | null = [];

    constructor(options: {id: string, name: string}) {
      if (options) {
        this.id = options.id;
        this.name = options.name;
      }
    }
  }
  export interface LocationEntity {
    view: string;
    locationCoordinates: string;
  }
  export interface CustomPropertiesEntity {
    Name: string;
    value: string;
  }
  export interface ElementsEntity {
    id: string;
    name: string;
  }

  export interface DimensionApiRequest {
    data: Dimension;
  }

  export interface DimensionSingleApiResponse {
    data?: Dimension | null;
  }

  
