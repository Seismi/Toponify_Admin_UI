export interface DimensionLinkApiResponse {
  data?: (DimensionLink)[] | null;
}
export interface DimensionLink {
  id: string;
  name: string;
  category: string;
  description: string;
  sourceDimension?: string;
  sourceCardinality?: number;
  targetDimension?: string;
  targetCardinality?: number;
  route?: (RouteEntity)[] | null;
  customProperties?: (CustomPropertiesEntity)[] | null;
  excludeFromModelLinks?: (ExcludeFromModelLinksEntity)[] | null;
}
export interface RouteEntity {
  view: string;
  points?: (string)[] | null;
}
export interface CustomPropertiesEntity {
  Name: string;
  value: string;
}
export interface ExcludeFromModelLinksEntity {
  modelLinkId: string;
}


export interface DimensionLinkApiRequest {
  data: DimensionLink;
}

export interface DimensionLinkSingleApiResponse {
  data?: DimensionLink | null;
}
