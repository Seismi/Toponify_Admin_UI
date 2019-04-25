export interface SystemLinkApiResponse {
    data?: (SystemLink)[] | null;
  }
  export interface SystemLink {
    id: string;
    name: string;
    description: string;
    category: string;
    label?: string;
    sourceSys?: string;
    sourceCardinality?: number;
    targetSys?: string;
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


export interface SystemLinkApiRequest {
  data: SystemLink;
}

export interface AddSystemLinkApiResponse {
  data?: SystemLink |  null;
}

export interface UpdateSystemLinkApiResponse {
  data?: SystemLink |  null;
}

