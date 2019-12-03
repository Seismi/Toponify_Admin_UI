export interface Authenticate {
  username: string;
  password: string;
  returnUrl: string;
}

interface AuthenticatePrivate {
  token: string;
}

interface AuthenticatePublic {
  id: string;
  roles: [];
  changePasswordRequired: boolean;
}

export interface AuthenticateApiResponse {
  data: {
    private: AuthenticatePrivate;
    public: AuthenticatePublic;
  };
}

export interface User {
  username: string;
}
