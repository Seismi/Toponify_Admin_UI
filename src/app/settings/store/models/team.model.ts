export interface GetTeamEntitiesApiResponse {
    data?: (TeamEntity)[] | null;
    links?: Links;
    page?: Page;
}

export interface GetTeamApiResponse {
    data: TeamDetails;
}

export interface AddTeamApiResponse {
    data: TeamDetails;
}

export interface UpdateTeamApiResponse {
    data: TeamDetails;
}

export interface TeamEntity {
  id: string;
  name: string;
  type: string;
}

export interface TeamEntitiesHttpParams {
    ownerQuery?: string;
    TeamQuery?: string;
    page?: number;
    size?: number;
}

export interface TeamDetails {
  id: string;
  name: string;
  description: string;
  type: string;
  members?: (MembersEntity)[] | null;
}

export interface MembersEntity {
  id: string;
  firstName: string;
  lastName: string;
  team?: (Team)[] | null;
  email: string;
  phone: string;
  roles?: (Roles)[] | null;
}

export interface Roles {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  type: string;
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
