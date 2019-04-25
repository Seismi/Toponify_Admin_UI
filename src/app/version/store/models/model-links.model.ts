export interface ModelLinkApiResponse {
    data?: (ModelLink)[] | null;
  }
  export interface ModelLink {
    id: string;
    category: string;
    name: string;
    description: string;
    label?: string;
    sourceModel?: string;
    sourceCardinality?: number;
    targetModel?: string;
    targetCardinality?: number;
    route?: (RouteEntity)[] | null;
    customProperties?: (CustomPropertiesEntity)[] | null;
    linkDetailAvailable?: boolean;
  }
  export interface RouteEntity {
    view: string;
    points?: (string)[] | null;
  }
  export interface CustomPropertiesEntity {
    Name: string;
    value: string;
  }

  export interface ModelLinkSingleApiResponse {
    data: ModelLink;
  }

  export interface ModelLinkApiRequest {
    data: ModelLink;
  }
