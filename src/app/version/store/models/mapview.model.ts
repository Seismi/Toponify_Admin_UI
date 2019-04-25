export interface MapViewApiResponse {
  data?: (MapView)[] | null;
  }
  export interface MapView {
    id: string;
    sourceModel: SourceModelOrTargetModel;
    targetModel: SourceModelOrTargetModel;
    dimlinks?: (DimlinksEntity)[] | null;
    dataFilters: DataFilters;
  }
  export interface SourceModelOrTargetModel {
    id: string;
    name: string;
    category: string;
    description: string;
    tags: string;
    owner: string;
    location?: (LocationEntity)[] | null;
    customProperties?: (CustomPropertiesEntity)[] | null;
    dimensions?: (DimensionsEntity)[] | null;
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
  export interface DimlinksEntity {
    id: string;
    name: string;
    category: string;
    description: string;
    sourceDimension: string;
    sourceCardinality: number;
    targetDimension: string;
    targetCardinality: number;
    route?: (RouteEntity)[] | null;
    customProperties?: (CustomPropertiesEntity)[] | null;
    excludeFromModelLinks?: (ExcludeFromModelLinksEntity)[] | null;
  }
  export interface RouteEntity {
    view: string;
    points?: (string)[] | null;
  }
  export interface ExcludeFromModelLinksEntity {
    modelLinkId: string;
  }
  export interface DataFilters {
    columns?: (ColumnsEntity)[] | null;
    slices?: (SlicesEntity)[] | null;
  }
  export interface ColumnsEntity {
    columnId: string;
    columnLabel: string;
    columnOrderNum: number;
  }
  export interface SlicesEntity {
    id: string;
    rowOrderNum: number;
    filters?: (FiltersEntity)[] | null;
  }
  export interface FiltersEntity {
    columnId: string;
    value: string;
  }
