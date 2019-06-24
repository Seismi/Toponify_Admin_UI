export interface UsersApiResponse {
    data?: (User)[] | null;
  }
  export interface UserDetailResponse {
    data: User;
  }
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    team?: (TeamEntity)[] | null;
    changePasswordRequired: boolean;
    email: string;
    phone: string;
    roles?: (RolesEntity)[] | null;
    settings: Settings;
    userStatus: string;
  }
  export interface TeamEntity {
    id: string;
    name: string;
    type: string;
  }
  export interface RolesEntity {
    id: string;
    name: string;
  }
  export interface Settings {
    interfaceSettings: InterfaceSettings;
  }
  export interface InterfaceSettings {
    settingName: string;
  }
  
  
export interface UserLoginData {
  username: string;
  password: string;
}

export interface AddUserApiResponse {
    data: User;
}

export interface UpdateUserApiResponse {
    data: User;
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
