export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  sessionVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  password?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserSession {
  id: string;
  name: string;
  email: string;
}

export interface IUserError {
  name?: string;
  email?: string;
  password?: string;
}
