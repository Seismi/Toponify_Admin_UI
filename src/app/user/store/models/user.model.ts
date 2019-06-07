export interface GetUserEntitiesApiResponse {
    data?: (UserEntity)[] | null;
    links: Links;
    page: Page;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface GetUserApiResponse {
    data: UserDetails;
}

export interface AddUserApiResponse {
    data: UserDetails;
}

export interface UpdateUserApiResponse {
    data: UserDetails;
}

export interface UserEntity {
    id: string;
    name: string;
}

export interface UserEntitiesHttpParams {
    ownerQuery?: string;
    userQuery?: string;
    page?: number;
    size?: number;
}

export interface UserDetails {
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
    test?: any;
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
