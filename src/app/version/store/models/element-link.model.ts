export interface ElementLinkApiResponse {
    data?: (ElementLink)[] | null;
  }
  export interface ElementLink {
    id: string;
    name: string;
    category: string;
    description: string;
    sourceElement?: string;
    sourceCardinality?: number;
    targetElement?: string;
    targetCardinality?: number;
    route?: (RouteEntity)[] | null;
    customProperties?: (CustomPropertiesEntity)[] | null;
  }
  export interface RouteEntity {
    view: string;
    points?: (string)[] | null;
  }
  export interface CustomPropertiesEntity {
    Name: string;
    value: string;
  }

  export interface ElementLinkApiRequest {
    data: ElementLink;
  }

  export interface AddElementLinkApiResponse {
    data?: ElementLink |  null;
  }

  export interface ElementLinkSingleApiResponse {
    data?: ElementLink | null;
  }
