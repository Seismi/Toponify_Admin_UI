export interface VersionSystemApiResponse {
  data?: (System)[] | null;
}
export enum systemCategories {
  relational = 'relational',
  multiDimensional = 'multidimensional'
}
export class System {
  id: string;
  name: string;
  category: systemCategories;
  description = '';
  tags = '';
  owner = '';
  location?: (LocationEntity)[] | null = [];
  customProperties?: (CustomPropertiesEntity)[] | null = [];
  models?: (ModelsEntity)[] | null = [];

  constructor(options: { id: string, name: string, category: systemCategories }) {
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
export interface ModelsEntity {
  id: string;
  name: string;
}

export interface SystemApiRequest {
  data: System;
}

export interface SystemApiResponse {
  data?: System | null;
}

export interface SystemSingleApiResponse {
  data?: System | null;
}
