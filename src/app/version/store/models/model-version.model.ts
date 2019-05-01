export interface ModelApiResponse {
  data?: (Model)[] | null;
}
export enum dataSetCategories {
  physical = 'physical',
  virtual = 'virtual',
  masterData = 'master data'
}
export class Model {
  id: string;
  name: string;
  category: dataSetCategories;
  description = '';
  tags = '';
  owner = '';
  location?: (LocationEntity)[] | null = [];
  customProperties?: (CustomPropertiesEntity)[] | null = [];
  dimensions?: (DimensionsEntity)[] | null = [];

  constructor(options: { id: string, name: string, category: dataSetCategories }) {
    if (options) {
      this.id = options.id;
      this.name = options.name;
      this.category = options.category;
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
