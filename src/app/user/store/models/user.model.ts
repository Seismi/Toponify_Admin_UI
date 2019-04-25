export interface UserApiResponse {
    data?: (User)[] | null;
}

export interface UpdateUserApiResponse {
    data?: (User) | null;
}

export interface AddUserApiResponse {
    data?: (User) | null;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    team?: (string)[] | null;
    roles?: (string)[] | null;
    settings: Settings;
    userStatus: string;
    changePasswordRequired?: boolean;
}

export interface Settings {
    interfaceSettings: InterfaceSettings;
}

export interface InterfaceSettings {
    settingName: string;
}


export interface UpdateUserApiRequest {
    data: UpdateUser;
}
interface UpdateUser {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    team?: (string)[] | null;
    roles?: (string)[] | null;
}
  

export interface AddUserApiRequest {
    data: AddUser;
}
interface AddUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    team?: (string)[] | null;
    roles?: (string)[] | null;
    userStatus: string;
}