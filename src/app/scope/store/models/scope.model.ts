export interface GetScopeEntitiesApiResponse {
    data?: (ScopeEntity)[] | null;
    links: Links;
    page: Page;
}

export interface GetScopeApiResponse {
    data: ScopeDetails;
}

export interface AddScopeApiResponse {
    data: ScopeDetails;
}

export interface UpdateScopeApiResponse {
    data: ScopeDetails;
}

export interface ScopeEntity {
    id: string;
    name: string;
}

export interface ScopeEntitiesHttpParams {
    ownerQuery?: string;
    scopeQuery?: string;
    page?: number;
    size?: number;
}

export interface ScopeDetails {
    id: string;
    name: string;
    owners?: (OwnersEntityOrViewersEntity)[] | null;
    viewers?: (OwnersEntityOrViewersEntity)[] | null;
    layerFilter: string;
    include: Include;
    layouts: Layout;
}
  
export interface OwnersEntityOrViewersEntity {
    id: string;
    name: string;
    type: string;
}

export interface Include {
    id: string;
    category: string;
    name: string;
    layer: string;
    description: string;
    tags: string;
    locations: ((LocationsEntityEntity)[] | null)[] | null;
    owners: (OwnersEntityOrViewersEntity)[] | null;
    descendants: (Descendants)[] | null;
}

export interface LocationsEntityEntity {
    layout: Layout;
    locationCoordinates: string;
}

export interface Layout {
    id: string;
    name: string;
}

export interface Descendants {
    // null
}


// TODO: This may be shared at some point
export interface Error {
    errors?: (ErrorsEntity)[] | null;
}
export interface ErrorsEntity {
    status: number;
    source: Source;
}
export interface Source {
    pointer: string;
    title: string;
    detail: string;
}

export interface Links {
    first: string;
    previous: string;
    next: string;
    last: string;
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}