export interface ModelApiResponse {
  data?: (Model)[] | null;
}

export class Model {
  id: string;
  name: string;
  category = 'model';
  description = '';
  tags = '';
  owner = '';
  location?: (LocationEntity)[] | null = [];
  customProperties?: (CustomPropertiesEntity)[] | null = [];
  dimensions?: (DimensionsEntity)[] | null = [];

  constructor(options: { id: string, name: string }) {
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
export interface DimensionsEntity {
  id: string;
  name: string;
}

export interface ModelApiRequest {
  data: Model;
}

export interface ModelSingleApiResponse {
  data?: Model | null;
}
