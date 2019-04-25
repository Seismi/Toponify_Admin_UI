export interface ElementApiResponse {
    data?: (Element)[] | null;
  }
export enum elementCategories {
  mdElement = 'mdelement',
  mdRule = 'mdrule'
}
export enum elementSubcategories {
  mdList = 'mdlist',
  mdStructure = 'mdstructure',
  mdRollup = 'mdrollup',
  or = 'or',
  inclusion = 'inclusion',
  combination = 'combination',
  exclusion = 'exclusion',
  custom = 'custom'
}
enum scopes {
  local = 'local',
  global = 'global'
}
  export class Element {
    id: string;
    name: string;
    category: elementCategories;
    subCategory?: elementSubcategories;
    scope?: scopes | null;
    logic? = '';
    description = '';
    tags = '';
    owner = '';
    location?: (LocationEntity)[] | null;
    customProperties?: (CustomPropertiesEntity)[] | null;
    attributes?: (AttributesEntity)[] | null;

    constructor(options: {id: string, name: string, category: elementCategories, subcategory: elementSubcategories}) {
      if (options) {
        this.id = options.id;
        this.name = options.name;
        this.category = options.category;
        this.subCategory = options.subcategory;
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
  export interface AttributesEntity {
    id: string;
    name: string;
  }

  export interface ElementApiRequest {
    data: Element;
  }

  export interface ElementResponse {
    data?: Element | null;
  }

  export interface ElementSingleApiResponse {
    data?: Element | null;
  }
